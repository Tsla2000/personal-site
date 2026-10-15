---
title: 美股观察卡片：一个 MCP App 的网站版
description: 把为 Claude 做的 MCP App 股票卡片搬上网站：可切换 NVDA/AVGO/MU/NBIS/TSLA，自选股存在浏览器本地，可直接交互体验。
date: 2026-10-15
category: AI
tags: [AI, MCP, 产品演示]
draft: false
---

# 美股观察卡片：一个 MCP App 的网站版

这张卡片最初是为 Claude 做的 [MCP App](https://modelcontextprotocol.io/extensions/apps/overview)：模型调用 `stock-card` 工具，卡片在对话里内联渲染，点"加入自选"会回调服务器并同步回模型上下文。

下面是它的网站独立版：同一套卡片设计，去掉了对 MCP host 的依赖，行情为演示数据，"加入自选"只保存在你的浏览器本地。可以直接点着玩：

<iframe src="/demo/stock-card.html" width="100%" height="560" style="border:1px solid var(--vp-c-divider);border-radius:8px" title="美股观察卡片演示"></iframe>

[在新窗口打开](/demo/stock-card.html)

技术说明：MCP 的工具调用机制是 AI host 的协议，搬不上静态网站；但卡片 UI 本身就是一份独立 HTML，移植过来只需要把"调服务器工具"换成"写浏览器本地存储"。
