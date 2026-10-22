---
image: /images/bing-wallpaper/cover.jpg
title: 必应每日壁纸 for Mac：用 REA 逆向 Windows 官方版，复刻到 macOS 的开源应用
description: 微软官方必应壁纸只有 Windows 版。fairzy 用 REA 逆向官方版 1.1.469.0 的行为，用 Swift 在 macOS 上原生复刻：菜单栏应用、每 30 分钟检查新图、12 个市场、主题轮换，MIT 开源免费。
keywords: 必应壁纸, Bing Wallpaper, Mac 壁纸, 每日壁纸, macOS, 开源应用, REA, 逆向工程
date: 2026-10-22
category: AI
tags: [macOS, 工具, 开源, 壁纸, 逆向]
draft: false
faq:
  - q: 这是微软官方的 Mac 版必应壁纸吗？
    a: 不是。必应壁纸官方应用只有 Windows 版。这是 fairzy 的独立开源实现，用 REA 逆向 Windows 官方版 1.1.469.0 的行为后在 macOS 上原生复刻，不隶属于微软。Bing 名称和每日图片的版权属于微软和拍摄者。
  - q: 哪些 Mac 能用？
    a: macOS 14 或更新版本。发布包是通用二进制，Apple 芯片和 Intel 用同一份应用。需要 Xcode 16 才能自己从源码构建。
  - q: 真的免费吗？
    a: 开源版免费，MIT 协议，源码在 GitHub。另有一个 Mac App Store 版「每日一张」即将上架，售价 US$2.99，图片经过开发者自己的服务器中转，两个版本可以同时安装。
  - q: 图片存在哪里？会上传我的数据吗？
    a: 图片存在 ~/Library/Application Support/BingWallpaper，只留在本地。没有账号，也没有遥测。Windows 官方版里的遥测、远程配置在复刻时被有意留在了外面。
  - q: 它会改我所有桌面的壁纸吗？
    a: macOS 只允许修改当前 Space 的壁纸。切到另一个 Space 时，应用会再补设一次。
---

# 必应每日壁纸 for Mac：用 REA 逆向 Windows 官方版，复刻到 macOS 的开源应用

<div class="meta-line">2026.10.22 · AI · 阅读约 5 分钟</div>

<div class="article-cover">

![必应每日壁纸 for Mac](/images/bing-wallpaper/cover.jpg)

*图：必应每日壁纸 for Mac——每日一张，自动换上你的桌面。*

</div>

必应每天一张的精选图片，很多人是当壁纸认识它的。

微软官方的必应壁纸应用只有 Windows 版。Mac 用户想每天自动换上当天的图，过去要么手动下载，要么找第三方工具凑合。

[必应每日壁纸 for Mac](https://fairzy.github.io/bingwallpaper-for-mac/) 是 fairzy 做的一个开源小应用，专门补这个缺口：装上之后设一次，之后每天自动把必应每日图片换成你的桌面。

它的做法值得说一句：不是照着界面仿一个壳，而是用 REA 逆向分析了 Windows 官方版 1.1.469.0 的实际行为，再用 Swift 在 macOS 上原生复刻。官网在 [fairzy.github.io/bingwallpaper-for-mac](https://fairzy.github.io/bingwallpaper-for-mac/)，源码在 [GitHub](https://github.com/fairzy/bingwallpaper-for-mac)，MIT 协议。

## 逆向复刻，复刻的是行为

仓库里有一份实现笔记，把 Windows 官方版的模块和 macOS 版的对应实现逐项列了出来。这种对照表，只有认真拆过原版行为的人才写得出。

| Windows 官方版 | macOS 复刻版 |
|---|---|
| DailyRefreshService：每 30 分钟刷新一次 | AppModel 刷新循环，系统唤醒后立即补刷 |
| Polly：失败重试与熔断 | withRetry / CircuitBreaker |
| LiteDB 本地库 images.db | index.json 索引，图片统一存一个文件夹 |
| 开机启动任务 | SMAppService 登录项，首次打开自动开启 |
| RotateThemeImageDailyMessage：主题图按天轮换 | 非必应主题每天换一张 |

没有搬过来的部分，同样写得明明白白：遥测、远程配置文件、热更新配置、画廊搜索、小部件，都不在复刻范围内。

这一点我很认可。逆向的目标是把有用的行为学过来，不是把原版的包袱一起背上。

## 它能做什么

- **每天自己换**：大约每 30 分钟检查一次新图。下载后核对文件大小和格式，不合格不设；失败按退避策略重试，不会对接口反复打。
- **只占菜单栏**：预览、往前翻最近几天、立刻刷新、暂停、退出，都在菜单栏弹出的小窗口里。没有 Dock 图标。
- **主题按天轮换**：除了必应每日图片，还可以选主题合集，非每日主题每天轮换一张。
- **跟着市场走**：中国、美国、日本等 12 个市场，标题和图片跟你选的市场一致。还能滤掉 AI 生成的图。
- **登录就在，醒来就补**：第一次打开会开启「登录时启动」。睡眠期间计时不暂停，唤醒后马上再刷一次。
- **图片留在本地**：文件存在 `~/Library/Application Support/BingWallpaper`。没有账号，也没有遥测。

## 两个版本

| | 开源版（本文介绍的） | App Store 版「每日一张」 |
|---|---|---|
| 价格 | 免费，MIT 开源 | US$2.99，即将上架 |
| 图片来源 | 你的 Mac 直接连必应公开接口 | 先到开发者自己的服务器，再回到你的 Mac |
| 差别 | 接口可用就一直能用 | 官方接口停了之后，已缓存的图还能继续换 |

两个版本可以同时安装，互不影响。

## 安装

1. 从 [GitHub Releases](https://github.com/fairzy/bingwallpaper-for-mac/releases) 下载 DMG（当前 v1.0.0）。
2. 打开磁盘映像，把 Bing Wallpaper 拖进「应用程序」。
3. 从启动台打开。菜单栏出现图片图标后，今天的必应壁纸就会换上。

发布包用 Developer ID 签名，并经过 Apple 公证，不用去安全性设置里手动放行。

要求：macOS 14 或更新版本，Apple 芯片和 Intel 通用。

## 自己构建

想改代码，或者想先看代码再装，也完全开放：

```bash
git clone https://github.com/fairzy/bingwallpaper-for-mac.git
cd bingwallpaper-for-mac
swift test              # 单元测试，离线可跑
scripts/build-app.sh    # 生成 build/BingWallpaper.app
open build/BingWallpaper.app
```

需要 macOS 14 和 Xcode 16（Swift 6）。注意仓库脚本默认是 ad-hoc 签名和占位 bundle id，只适合自己用；正式发布包用的是 `com.fairzy.bingwallpaper`。

## 一个限制先说清

macOS 只允许应用修改当前 Space 的壁纸。切到另一个 Space 时，它会再补设一次。这是系统限制，所有同类应用都一样。

## 常见问题

### 这是微软官方的 Mac 版吗？

不是。官方只有 Windows 版。这是独立的开源实现，不隶属于微软。

### 它和官方 Windows 版功能一样吗？

核心行为按官方版 1.1.469.0 复刻：30 分钟刷新、主题轮换、登录启动、本地图片管理。遥测、远程配置、画廊搜索和小部件没有搬。

### App Store 版值得等吗？

两个版本的区别只在图片通道：开源版直连必应接口，App Store 版多一层开发者自己的服务器。如果你担心必应接口哪天停掉，App Store 版的缓存机制更稳妥；只想现在就用，开源版下载即用。

### 会不会偷偷上传数据？

不会。没有账号，没有遥测，图片和索引都在本地目录。源码全开，可以自己核对。
