---
title: "Website Launch Checklist: QA, SEO, Mobile, Analytics, and Rollback"
description: A practical pre-release checklist for websites covering core user journeys, broken links, mobile layouts, SEO metadata, social previews, analytics events, and rollback readiness.
date: 2026-10-19
keywords: website launch checklist, website QA, technical SEO checklist, mobile testing, VitePress deployment
aside: false
---

# Website Launch Checklist: QA, SEO, Mobile, Analytics, and Rollback

A successful build only means the build tool found no blocking errors. Links may still point to the wrong path, mobile layouts may overflow, social preview images may be stale, and search engines may see the wrong canonical URL.

Use this checklist for static sites, documentation sites, personal blogs, and small product websites. Scale it to the risk of the release rather than treating it as ceremony.

## 1. Functionality and links

- The homepage, main categories, detail pages, and 404 page load correctly.
- Internal links do not lead to 404s, the wrong language, or an old domain.
- Copy, download, forms, search, and primary buttons have been tested in the browser.
- Downloaded files exist and match their page descriptions.
- Language switching works and points to the corresponding page where one exists.

## 2. Mobile and accessibility

- Check headings, cards, tables, navigation, and code blocks on narrow screens.
- There is no unintended horizontal overflow; primary actions have usable tap targets.
- Images have useful alternative text and form controls have accessible labels.
- Primary tasks can be completed with a keyboard and focus states are visible.
- Images load efficiently and do not unnecessarily delay the first screen.

## 3. SEO and social sharing

- Every important page has a unique title and description.
- Canonical URLs point to the production page, not a preview host or legacy domain.
- The sitemap includes intended pages and robots.txt points to the correct sitemap.
- Chinese and English pages use correct hreflang and are adapted to their audiences.
- Open Graph and Twitter Card titles, descriptions, and images are correct.
- Structured data parses and matches visible page content.
- Preview environments and internal tools are not accidentally indexed.

## 4. Analytics and privacy

- Page analytics works where the visitor allows it.
- Important actions such as copy and download use stable, readable event names.
- Do not send prompts, clipboard contents, file contents, or API keys to analytics.
- The website still works if analytics is blocked.
- Track events that support product decisions, not data that has no clear purpose.

## 5. Deployment and rollback

- Run the production build and SEO checks in the target environment.
- Verify environment variables for production domain, base path, and canonical URL.
- Inspect the deployed URLs rather than relying only on a green CI run.
- Keep a known-good version and document how to roll back.
- Record the release scope, checks run, checks skipped, and known risks.

## Minimal release record

```text
Version / commit:
Release scope:
Build result:
Functional checks:
SEO checks:
Mobile checks:
Analytics events:
Checks not run:
Known risks:
Rollback:
```

## Recommended acceptance order

Run the build and automated checks first, sample high-traffic pages and critical user journeys next, then verify the production domain, social previews, and analytics events. Automation is best for repeatable checks; manual review is still needed for experience and risk.

To make this repeatable with an agent, start with the [website launch QA skill](../../skills/website-launch-check) and use the [AI project delivery workflow](./ai-project-delivery-workflow) for a clear handoff.
