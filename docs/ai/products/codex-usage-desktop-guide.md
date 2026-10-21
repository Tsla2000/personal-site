---
title: Codex Usage Desktop 使用指南：看清 Token 去向与剩余额度
description: 朋友开源的 Codex 用量桌面应用，本地读取会话日志，查看 Token、5 小时与周额度、项目与会话明细。附安装方式、使用步骤与隐私说明。
keywords: Codex 用量, Codex 额度, Codex Token 统计, Codex Usage Desktop, Codex 额度重置
date: 2026-10-21
category: AI
tags: [AI, Codex, 工具, 开源]
draft: false
image: /images/codex-usage/cover.jpg
---

# Codex Usage Desktop 使用指南：看清 Token 去向与剩余额度

每天用 Codex，迟早会遇到这几个问题：5 小时额度还剩多少，什么时候重置，哪个项目最烧 Token。

[Codex Usage Desktop](https://codex-usage.itvincent.net/zh/) 是我朋友 itvincent 做的开源桌面应用，专门回答这些问题。它直接读取电脑上已有的 Codex 会话日志，整理成一个本地看板。不需要 API Key，不需要注册账号，也不上传日志。

本文根据项目 [README](https://github.com/itvincent-git/codex-usage-desktop/blob/main/README_zh.md) 整理，方便先看明白它能做什么、怎么装、怎么用。细节以官方仓库为准。

## 它能解决什么问题

- 5 小时额度、周额度还剩多少，什么时候重置
- 哪个项目、模型、会话消耗了最多 Token
- 今天的用量和昨天比怎么样
- 一段很长的会话里，Codex 到底做了什么

## 主要功能

### 用量总览

不用翻 JSONL 日志，就能看到：

- Token 总量与预估成本
- 输入、输出、缓存 Token 用量和缓存命中率
- 每日、每月趋势和日均用量
- 自定义日期范围

### 实时额度

在触及上限前掌握剩余额度：

- 实时 5 小时额度、周度或月度额度
- 剩余额度、重置时间和倒计时
- 可用重置次数

额度信息还能显示在 macOS 菜单栏或 Windows 系统托盘，不用一直开着看板。实时额度使用本机已有的 Codex 登录状态，所以要先在 CLI 登录。

### 拆解 Token 消耗

可以按项目、模型、日期、月份、会话来拆分用量。

- **项目视图**：并排对比各项目的每日趋势，查看非缓存输入、缓存输入、输出和预估成本，点进去还能搜索按日期分组的会话。
- **模型视图**：估算每个模型对 5 小时额度和周额度的消耗，包括每百万 Token 的消耗。这个估算来自只用了单一模型的会话快照，同时进行的会话可能影响归属结果。

### 会话详情

按标题、项目、模型搜索会话，打开后能看到：

- Token 用量、预估成本和额度消耗
- 命令与工具活动、网页搜索
- 补丁与代码差异
- 长时间运行的命令、子代理层级
- 会话回放时间线

既能看到 Codex 做了什么，也能看到这些工作花了多少用量。

### 额度重置记录

可以查看最近一次官方 Token 重置公告、近期重置事件，以及从会话日志里观测到的每日剩余额度变化。

### 其他

- 原生 macOS 与 Windows 应用，开机启动，自动检查更新
- 界面支持简体中文、繁体中文、English 和日本語，有浅色和深色主题
- 可把当前时间范围的数据导出为 Excel 或 Markdown

## 安装

下载入口：[GitHub Releases](https://github.com/itvincent-git/codex-usage-desktop/releases/latest)，也可以从[官网](https://codex-usage.itvincent.net/zh/download/)进入。

### Windows 10/11 x64

下载 Windows 安装程序，按提示安装即可，采用当前用户安装模式。

安装器目前没有 Authenticode 签名，SmartScreen 可能提示"无法识别的应用"。继续前请确认文件来自官方仓库的 GitHub Release。

应用优先读取 `%USERPROFILE%\.codex` 里的原生 Windows 会话。如果里面没有会话，会自动检查默认 WSL 发行版。两边的会话不会合并，避免重复统计。

### macOS

按芯片选择 DMG：

| Mac | 版本 |
| --- | --- |
| Apple 芯片（M1 及更新） | ARM64 DMG |
| Intel | x64 DMG |

打开 DMG，把应用拖进"应用程序"。如果首次启动被系统拦截，到 **系统设置 → 隐私与安全性** 里允许打开。

### Homebrew

```bash
brew tap itvincent-git/codex-usage-desktop https://github.com/itvincent-git/codex-usage-desktop
brew install --cask itvincent-git/codex-usage-desktop/codex-usage-desktop
```

以后升级：

```bash
brew update
brew upgrade --cask itvincent-git/codex-usage-desktop/codex-usage-desktop
```

### 终端一键安装（macOS）

脚本会自动识别芯片类型，下载对应 DMG 并复制到 `/Applications`：

```bash
curl -fsSL https://raw.githubusercontent.com/itvincent-git/codex-usage-desktop/main/scripts/install.sh | sh
```

这类脚本建议先打开链接看一遍内容再运行。

## 三步上手

1. 正常使用 Codex CLI，确保 `~/.codex`（Windows 是 `%USERPROFILE%\.codex`）下已有会话日志。
2. 打开应用，它会扫描本地日志并建立 SQLite 索引。
3. 选好时间范围，再去模型、项目、按日、按月、会话页面查看。

想看实时账户额度，需要本机 Codex CLI 已登录。没登录的话先运行：

```bash
codex auth login
```

然后在看板里刷新。

## 隐私：数据去了哪里

Codex 会话里可能有敏感提示词、代码和项目信息，所以这一点值得单独说：

- `~/.codex` 下的源文件只在本地读取，不会上传、分享或修改。
- 不需要输入 OpenAI 或 LiteLLM 的 API Key。
- 汇总后的统计存在本机的 SQLite 缓存里。
- 实时额度会用本机的登录状态直接向 ChatGPT 查询，请求里不带会话日志。
- 联网还用于加载字体、模型定价、额度预测和检查更新，这些请求不含会话日志和用量数据。

## 使用边界

- 目前支持 Apple 芯片与 Intel Mac、Windows 10/11 x64，没有 Linux 安装包。
- 成本是根据本地日志和可用模型定价算出的估算值，未知模型的预估成本为零。
- 会话明细取决于本地日志实际记录了什么。

## 高级选项

用环境变量调整行为：

| 变量 | 作用 |
| --- | --- |
| `CODEX_HOME` | 指定 Codex home 目录，非空时优先级最高，并关闭 Windows/WSL 自动发现 |
| `CODEX_CLI_PATH` | 指定 Codex CLI 可执行文件或包装器路径 |
| `CODEX_USAGE_TIMEZONE` | 按日统计使用的时区，默认系统时区，失败时回退 UTC |

## 相关链接

- 官网：[codex-usage.itvincent.net](https://codex-usage.itvincent.net/zh/)
- 开源仓库：[itvincent-git/codex-usage-desktop](https://github.com/itvincent-git/codex-usage-desktop)
- 更多朋友的项目：[友链](/friends)
