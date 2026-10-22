---
image: /images/bing-wallpaper/cover.jpg
title: "Bing Wallpaper for Mac: An Open-Source Port Reverse-Engineered from the Official Windows App with REA"
description: "Microsoft's Bing Wallpaper is Windows-only. fairzy reverse-engineered the official app's behavior (v1.1.469.0) with REA and rebuilt it natively in Swift for macOS: a menu-bar app that checks every 30 minutes, 12 markets, daily theme rotation. MIT licensed and free."
keywords: "Bing Wallpaper, Mac wallpaper, daily wallpaper, macOS, open source, REA, reverse engineering"
date: 2026-10-22
category: AI
tags: [macOS, tools, open source, wallpaper, reverse engineering]
draft: false
faq:
  - q: Is this Microsoft's official Bing Wallpaper for Mac?
    a: No. The official Bing Wallpaper app is Windows-only. This is fairzy's independent open-source implementation, reverse-engineered from the Windows app v1.1.469.0 with REA and rebuilt natively for macOS. It is not affiliated with Microsoft. Bing and the daily images belong to Microsoft and the photographers.
  - q: Which Macs can run it?
    a: macOS 14 or later. The release is a universal binary, so Apple silicon and Intel use the same app. Building from source needs Xcode 16.
  - q: Is it really free?
    a: The open-source edition is free under the MIT license, with source on GitHub. A separate Mac App Store app, Daily One, is coming soon at US$2.99; its images route through the developer's own server, and the two editions can be installed side by side.
  - q: Where do the images live? Does it upload anything?
    a: Images stay in ~/Library/Application Support/BingWallpaper, on your Mac only. There is no account and no telemetry. The Windows app's telemetry and remote configuration were deliberately left out of the port.
  - q: Does it change the wallpaper on all my desktops?
    a: macOS only lets an app change the current Space's wallpaper. When you switch to another Space, the app applies it there again.
---

# Bing Wallpaper for Mac: An Open-Source Port Reverse-Engineered from the Official Windows App with REA

<div class="meta-line">2026.10.22 · AI · 5 min read</div>

<div class="article-cover">

![Bing Wallpaper for Mac](/images/bing-wallpaper/cover.jpg)

*Bing Wallpaper for Mac — a new photo every day, set as your desktop automatically.*

</div>

Most people know Bing's daily photo as a wallpaper.

Microsoft's official Bing Wallpaper app, however, is Windows-only. If you wanted the day's photo on your Mac desktop automatically, your options were downloading it by hand or settling for a third-party workaround.

[Bing Wallpaper for Mac](https://fairzy.github.io/bingwallpaper-for-mac/) is a small open-source app by fairzy that fills exactly that gap: set it up once, and every day the Bing daily image becomes your desktop.

How it was made is worth a sentence of its own. It is not a shell copying the interface. The behavior of the official Windows app, version 1.1.469.0, was reverse-engineered with REA, then rebuilt natively in Swift for macOS. The site is at [fairzy.github.io/bingwallpaper-for-mac](https://fairzy.github.io/bingwallpaper-for-mac/), the source is on [GitHub](https://github.com/fairzy/bingwallpaper-for-mac), MIT licensed.

## A port of behavior, not of pixels

The repository ships implementation notes that map the Windows app's modules to their macOS counterparts, item by item. You only write a table like that after taking the original's behavior apart carefully.

| Windows app | macOS port |
|---|---|
| DailyRefreshService: refresh every 30 minutes | AppModel refresh loop, with an immediate refresh on wake |
| Polly: retry and circuit breaking | withRetry / CircuitBreaker |
| LiteDB local store, images.db | index.json index, one shared images folder |
| Startup task | SMAppService login item, enabled on first launch |
| RotateThemeImageDailyMessage: themes rotate daily | Non-Bing themes rotate one image a day |

What was left out is documented just as plainly: telemetry, remote config files, hot config updates, gallery search and widgets are all out of scope.

That is a stance I agree with. The point of reverse engineering is to learn the behavior that is useful, not to inherit the original's baggage.

## What it does

- **Changes itself every day**: checks for a new image roughly every 30 minutes. Downloads are verified for size and format before being applied; failures retry with backoff instead of hammering the API.
- **Lives in the menu bar**: preview, step back through recent days, refresh now, pause and quit, all in the popover. No Dock icon.
- **Themes rotate daily**: besides the Bing daily image, you can pick theme collections; non-daily themes rotate one image per day.
- **Follows your market**: 12 markets including China, the US and Japan, with titles and photos matching your pick. AI-generated images can be filtered out.
- **There at login, catches up on wake**: login launch is enabled the first time you open it. The timer does not pause during sleep, and it refreshes again right after wake.
- **Images stay local**: files live in `~/Library/Application Support/BingWallpaper`. No account, no telemetry.

## Two editions

| | Open-source edition (this article) | App Store edition, Daily One |
|---|---|---|
| Price | Free, MIT | US$2.99, coming soon |
| Image route | Your Mac talks to Bing's public API directly | Images pass through the developer's own server first |
| Difference | Works as long as the API does | Cached images keep rotating even if the official API stops |

The two editions can be installed side by side.

## Install

1. Download the DMG from [GitHub Releases](https://github.com/fairzy/bingwallpaper-for-mac/releases) (currently v1.0.0).
2. Open the disk image and drag Bing Wallpaper into Applications.
3. Launch it. Once the picture icon appears in the menu bar, today's Bing photo is set.

The release DMG is Developer ID signed and notarized, so there is no manual security override.

Requirements: macOS 14 or later, universal for Apple silicon and Intel.

## Build it yourself

If you would rather read the code first, or change it, that is fully open too:

```bash
git clone https://github.com/fairzy/bingwallpaper-for-mac.git
cd bingwallpaper-for-mac
swift test              # unit tests, run offline
scripts/build-app.sh    # writes build/BingWallpaper.app
open build/BingWallpaper.app
```

You need macOS 14 and Xcode 16 (Swift 6). Note that the repo script defaults to ad-hoc signing and a placeholder bundle id, fine for your own use; the notarized release uses `com.fairzy.bingwallpaper`.

## One limit, stated up front

macOS only lets an app change the wallpaper of the current Space. Switch Spaces and it applies the image there again. That is a system limit, and every app of this kind has it.

## FAQ

### Is this Microsoft's official Mac version?

No. The official app is Windows-only. This is an independent open-source implementation, not affiliated with Microsoft.

### Does it match the official Windows app's features?

The core behavior follows the official v1.1.469.0: 30-minute refresh, theme rotation, login launch, local image management. Telemetry, remote config, gallery search and widgets were not ported.

### Is the App Store edition worth waiting for?

The only difference is the image route: the open-source edition calls Bing's API directly, while the App Store edition adds the developer's own server in between. If you worry about the Bing API going away one day, the App Store edition's caching is the safer design. If you want it today, the open-source edition is a download away.

### Does it upload anything quietly?

No. No account, no telemetry; images and the index live in a local folder. The source is fully open, so you can verify that yourself.
