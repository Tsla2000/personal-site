#!/usr/bin/env python3
"""Sync VitePress dist/ to Tencent COS for the WeChat-shareable mirror.

- Uploads docs/.vitepress/dist under the `personal-site/` prefix.
- Strips `.html` from object keys (except index.html / 404.html) so clean
  URLs work on COS static-website hosting without extension mapping.
- Sets Content-Type / Cache-Control sensibly.
- Skips unchanged files (MD5 vs ETag) and deletes stale keys.
- Ensures static-website config (index.html + 404.html).

Env: COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET, COS_REGION (default ap-beijing)
"""
import hashlib
import mimetypes
import os
import sys

from qcloud_cos import CosConfig, CosS3Client

BUCKET = os.environ["COS_BUCKET"]
REGION = os.environ.get("COS_REGION", "ap-beijing")
PREFIX = "personal-site/"
DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs", ".vitepress", "dist")

EXTRA_TYPES = {
    ".xml": "application/xml",
    ".txt": "text/plain; charset=utf-8",
    ".webmanifest": "application/manifest+json",
    ".svg": "image/svg+xml",
}
for ext, ctype in EXTRA_TYPES.items():
    mimetypes.add_type(ctype, ext)


def md5_of(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def key_for(rel):
    """rel: posix relative path inside dist/ -> COS object key."""
    name = rel.rsplit("/", 1)[-1]
    if name.endswith(".html") and name not in ("index.html", "404.html"):
        rel = rel[: -len(".html")]
    return PREFIX + rel


def content_type_for(rel):
    ctype, _ = mimetypes.guess_type(rel)
    if rel.endswith(".html"):
        return "text/html; charset=utf-8"
    return ctype or "application/octet-stream"


def cache_control_for(key):
    if "/assets/" in key:
        return "public, max-age=31536000, immutable"
    if key.endswith(".xml") or key.endswith(".txt"):
        return "public, max-age=3600"
    return "public, max-age=300"


def main():
    config = CosConfig(
        Region=REGION,
        SecretId=os.environ["COS_SECRET_ID"],
        SecretKey=os.environ["COS_SECRET_KEY"],
    )
    client = CosS3Client(config)

    # Build desired key -> local path map.
    desired = {}
    for root, _dirs, files in os.walk(DIST):
        for fn in files:
            local = os.path.join(root, fn)
            rel = os.path.relpath(local, DIST).replace(os.sep, "/")
            desired[key_for(rel)] = local
    print(f"[sync-cos] {len(desired)} local files -> s3://{BUCKET}/{PREFIX}")

    # List existing keys under the prefix.
    existing = {}  # key -> etag
    marker = ""
    while True:
        resp = client.list_objects(Bucket=BUCKET, Prefix=PREFIX, Marker=marker, MaxKeys=1000)
        for obj in resp.get("Contents", []) or []:
            etag = (obj.get("ETag") or "").strip('"')
            # Multipart ETags contain '-', skip comparison for those.
            existing[obj["Key"]] = None if "-" in etag else etag
        if resp.get("IsTruncated") == "true":
            marker = resp.get("NextMarker") or list(existing)[-1]
        else:
            break
    print(f"[sync-cos] {len(existing)} existing keys under prefix")

    uploaded, skipped = 0, 0
    for key, local in sorted(desired.items()):
        etag = existing.get(key)
        if etag is not None and etag == md5_of(local):
            skipped += 1
            continue
        with open(local, "rb") as f:
            client.put_object(
                Bucket=BUCKET,
                Key=key,
                Body=f,
                ContentType=content_type_for(local),
                CacheControl=cache_control_for(key),
            )
        uploaded += 1
    print(f"[sync-cos] uploaded={uploaded} skipped(unchanged)={skipped}")

    stale = [k for k in existing if k not in desired]
    for i in range(0, len(stale), 1000):
        batch = stale[i : i + 1000]
        client.delete_objects(
            Bucket=BUCKET, Delete={"Object": [{"Key": k} for k in batch], "Quiet": "true"}
        )
    print(f"[sync-cos] deleted stale={len(stale)}")

    # Ensure static-website hosting config (idempotent).
    client.put_bucket_website(
        Bucket=BUCKET,
        WebsiteConfiguration={
            "IndexDocument": {"Suffix": "index.html"},
            "ErrorDocument": {"Key": PREFIX + "404.html"},
        },
    )
    print("[sync-cos] website config ok (index.html / 404.html)")


if __name__ == "__main__":
    for var in ("COS_SECRET_ID", "COS_SECRET_KEY", "COS_BUCKET"):
        if not os.environ.get(var):
            sys.exit(f"[sync-cos] missing env {var}")
    if not os.path.isdir(DIST):
        sys.exit(f"[sync-cos] dist not found: {DIST} (run npm run docs:build first)")
    main()
