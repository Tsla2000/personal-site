#!/usr/bin/env python3
"""Publish a Markdown article to WeChat Official Account via API.

Flow: access_token -> upload images (permanent materials) ->
markdown -> WeChat-friendly HTML (inline styles) -> draft/add ->
optional freepublish/submit.

Internal site links (/ai/...) are stripped to plain text (github.io is
blocked in WeChat); external links are kept.

Env: WECHAT_APPID, WECHAT_APPSECRET
Args: --article docs/....md --mode draft|publish (default draft)
"""
import argparse
import os
import re
import sys
import time

import requests

API = "https://api.weixin.qq.com"
SITE_URL = "https://tsla2000.github.io/personal-site"

# ---------- WeChat inline styles (the MP backend strips <style> tags) ----------
ST = {
    "h1": "font-size:22px;font-weight:700;color:#1a1a1a;margin:0 0 16px;line-height:1.4;",
    "h2": "font-size:18px;font-weight:700;color:#1a1a1a;margin:30px 0 12px;line-height:1.5;",
    "h3": "font-size:16px;font-weight:700;color:#1a1a1a;margin:24px 0 10px;line-height:1.5;",
    "p": "font-size:16px;color:#333333;margin:0 0 16px;line-height:1.9;text-align:justify;",
    "meta": "font-size:13px;color:#999999;margin:0 0 22px;line-height:1.6;",
    "blockquote": "margin:0 0 16px;padding:12px 16px;border-left:3px solid #07c160;"
                "background:#f7f7f7;color:#666666;font-size:15px;line-height:1.8;",
    "pre": "background:#f6f6f6;border-radius:6px;padding:14px;margin:0 0 16px;overflow-x:auto;",
    "code_pre": "font-family:Menlo,Consolas,monospace;font-size:13px;color:#333333;line-height:1.7;",
    "code_inline": "font-family:Menlo,Consolas,monospace;font-size:14px;background:#f0f0f0;"
                   "padding:2px 6px;border-radius:4px;color:#c7254e;",
    "ul": "margin:0 0 16px;padding-left:24px;color:#333333;font-size:16px;line-height:1.9;",
    "ol": "margin:0 0 16px;padding-left:24px;color:#333333;font-size:16px;line-height:1.9;",
    "li": "margin-bottom:8px;",
    "img": "max-width:100%;height:auto;border-radius:6px;margin:10px 0;display:block;",
    "img_cap": "font-size:13px;color:#999999;text-align:center;margin:-4px 0 16px;line-height:1.6;",
    "a": "color:#576b95;text-decoration:none;",
    "strong": "font-weight:700;color:#1a1a1a;",
    "hr": "border:none;border-top:1px solid #eeeeee;margin:26px 0;",
}


def api_get(path, params):
    r = requests.get(API + path, params=params, timeout=30)
    data = r.json()
    if data.get("errcode"):
        raise RuntimeError(f"GET {path} failed: {data}")
    return data


def api_post(path, token, payload):
    r = requests.post(API + path, params={"access_token": token}, json=payload, timeout=60)
    data = r.json()
    if data.get("errcode"):
        raise RuntimeError(f"POST {path} failed: {data}")
    return data


def get_token(appid, secret):
    data = api_get("/cgi-bin/token", {
        "grant_type": "client_credential", "appid": appid, "secret": secret})
    print("[mp] access_token ok")
    return data["access_token"]


def upload_image(token, local_path):
    with open(local_path, "rb") as f:
        r = requests.post(
            API + "/cgi-bin/material/add_material",
            params={"access_token": token, "type": "image"},
            files={"media": (os.path.basename(local_path), f, "image/png")},
            timeout=120,
        )
    data = r.json()
    if data.get("errcode"):
        raise RuntimeError(f"upload {local_path} failed: {data}")
    print(f"[mp] image uploaded: {local_path} -> media_id={data['media_id']}")
    return data["media_id"], data["url"]


def make_cover(title, out_path):
    """Generate a minimal branded cover (900x500) with the article title."""
    from PIL import Image, ImageDraw, ImageFont

    W, H = 900, 500
    img = Image.new("RGB", (W, H), "#FAF8F3")
    d = ImageDraw.Draw(img)
    d.rectangle([28, 28, W - 28, H - 28], outline="#1a1a1a", width=3)

    font = None
    for p in [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
        "/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc",
    ]:
        if os.path.exists(p):
            font = p
            break
    if not font:
        raise RuntimeError("no CJK font found for cover generation")
    title_font = ImageFont.truetype(font, 54)
    foot_font = ImageFont.truetype(font, 28)

    # wrap title: ~11 CJK chars per line
    lines, cur = [], ""
    for ch in title:
        cur += ch
        if len(cur) >= 11:
            lines.append(cur)
            cur = ""
    if cur:
        lines.append(cur)
    lines = lines[:3]
    y = H // 2 - len(lines) * 40
    for line in lines:
        bb = d.textbbox((0, 0), line, font=title_font)
        d.text(((W - (bb[2] - bb[0])) / 2, y), line, font=title_font, fill="#1a1a1a")
        y += 80
    foot = "PRO的茶里芒果"
    bb = d.textbbox((0, 0), foot, font=foot_font)
    d.text(((W - (bb[2] - bb[0])) / 2, H - 110), foot, font=foot_font, fill="#999999")
    img.save(out_path)
    print(f"[mp] cover generated: {out_path}")


def inline_styles(html):
    """Add inline styles to common tags (regex-based, WeChat-safe)."""
    S = ST
    # meta line first (must precede the generic <p> rule)
    html = html.replace("<p data-mp-meta>", f"<p style=\"{S['meta']}\">")
    html = re.sub(r"<h1(\s[^>]*)?>", f"<h1 style=\"{S['h1']}\">", html)
    html = re.sub(r"<h2(\s[^>]*)?>", f"<h2 style=\"{S['h2']}\">", html)
    html = re.sub(r"<h3(\s[^>]*)?>", f"<h3 style=\"{S['h3']}\">", html)
    html = re.sub(r"<p(?![^>]*style=)(\s[^>]*)?>", f"<p style=\"{S['p']}\">", html)
    html = re.sub(r"<blockquote(\s[^>]*)?>", f"<blockquote style=\"{S['blockquote']}\">", html)
    html = re.sub(r"<pre(\s[^>]*)?><code(\s[^>]*)?>",
                  f"<pre style=\"{S['pre']}\"><code style=\"{S['code_pre']}\">", html)
    html = re.sub(r"<code(\s[^>]*)?>", f"<code style=\"{S['code_inline']}\">", html)
    html = re.sub(r"<ul(\s[^>]*)?>", f"<ul style=\"{S['ul']}\">", html)
    html = re.sub(r"<ol(\s[^>]*)?>", f"<ol style=\"{S['ol']}\">", html)
    html = re.sub(r"<li(\s[^>]*)?>", f"<li style=\"{S['li']}\">", html)
    html = re.sub(r"<a(\s[^>]*)?href=\"([^\"]+)\"([^>]*)>",
                  lambda m: f"<a href=\"{m.group(2)}\" style=\"{S['a']}\">", html)
    html = re.sub(r"<strong(\s[^>]*)?>", f"<strong style=\"{S['strong']}\">", html)
    html = re.sub(r"<b(\s[^>]*)?>", f"<b style=\"{S['strong']}\">", html)
    html = re.sub(r"<hr(\s[^>]*)?/?>", f"<hr style=\"{S['hr']}\">", html)
    # images: keep original attrs (src/alt), append style
    html = re.sub(r"<img([^>]*)>",
                  lambda m: "<img" + re.sub(r"\s*/?$", "", m.group(1))
                            + f" style=\"{S['img']}\">", html)
    # italic image captions "*图：...*" -> centered gray
    html = re.sub(r"<p style=\"[^\"]*\"><em>(图[:：].*?)</em></p>",
                  f"<p style=\"{S['img_cap']}\">\\1</p>", html)
    return html


def parse_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    fm, body = {}, text
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip("'\"")
        body = text[m.end():]
    return fm, body


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--article", required=True)
    ap.add_argument("--mode", default="draft", choices=["draft", "publish"])
    args = ap.parse_args()

    appid = os.environ.get("WECHAT_APPID")
    secret = os.environ.get("WECHAT_APPSECRET")
    if not appid or not secret:
        sys.exit("[mp] missing env WECHAT_APPID / WECHAT_APPSECRET")

    repo_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    md_path = os.path.join(repo_root, args.article)
    fm, body = parse_frontmatter(open(md_path, encoding="utf-8").read())
    title = fm.get("title", os.path.basename(md_path))
    digest = fm.get("description", "")[:120]

    # canonical page path for content_source_url
    rel = args.article
    if rel.startswith("docs/"):
        rel = rel[len("docs/"):]
    page_path = "/" + re.sub(r"\.md$", "", rel)

    token = get_token(appid, secret)

    # 1) upload local images, rewrite to WeChat CDN URLs
    img_map = {}  # media_id in order
    def _up(m):
        alt, src = m.group(1), m.group(2)
        if src.startswith("http"):
            return m.group(0)
        local = os.path.join(repo_root, "docs", "public", src.lstrip("/"))
        if not os.path.exists(local):
            print(f"[mp] WARN image not found: {local}, keeping as-is")
            return m.group(0)
        media_id, url = upload_image(token, local)
        img_map[src] = (media_id, url)
        return f"![{alt}]({url})"
    body = re.sub(r"!\[([^\]]*)\]\((/images/[^)]+)\)", _up, body)

    # 2) meta-line div -> styled paragraph
    body = re.sub(r'<div class="meta-line">(.*?)</div>',
                  r"<p data-mp-meta>\1</p>", body, flags=re.S)
    # 3) drop prev/next nav line (meaningless in MP)
    body = re.sub(r"^上一篇：.*$", "", body, flags=re.M)
    # 4) internal site links -> plain text (github.io blocked in WeChat)
    body = re.sub(r"(?<!!)\[([^\]]+)\]\((/[^)]*)\)", r"\1", body)

    import markdown
    html = markdown.markdown(body, extensions=["fenced_code", "tables", "sane_lists"])
    html = inline_styles(html)

    # 5) cover: first image, else generate
    if img_map:
        first_src = next(iter(img_map))
        thumb_media_id = img_map[first_src][0]
    else:
        cover_path = "/tmp/mp-cover.png"
        make_cover(title, cover_path)
        thumb_media_id, _ = upload_image(token, cover_path)

    # 6) create draft
    draft = api_post("/cgi-bin/draft/add", token, {
        "articles": [{
            "title": title,
            "author": "PRO的茶里芒果",
            "digest": digest,
            "content": html,
            "content_source_url": SITE_URL + page_path,
            "thumb_media_id": thumb_media_id,
            "need_open_comment": 1,
            "only_fans_can_comment": 0,
        }]
    })
    media_id = draft["media_id"]
    print(f"[mp] draft created: media_id={media_id}")

    if args.mode == "publish":
        pub = api_post("/cgi-bin/freepublish/submit", token, {"media_id": media_id})
        publish_id = pub["publish_id"]
        print(f"[mp] publish submitted: publish_id={publish_id}")
        for _ in range(20):
            time.sleep(15)
            st = api_post("/cgi-bin/freepublish/get", token, {"publish_id": publish_id})
            print(f"[mp] publish status: {st.get('publish_status')}")
            if st.get("publish_status") == 0:
                print(f"[mp] published: {st.get('article_detail', {}).get('infos', [{}])[0].get('article_url')}")
                break
    print("[mp] DONE")


if __name__ == "__main__":
    main()
