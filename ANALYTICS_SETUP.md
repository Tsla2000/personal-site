# 访问统计接入说明

二选一即可,都不需要改文章内容。两个都是隐私友好的轻量统计,无 Cookie 横幅烦恼。

## 方案 A:Umami(推荐,有免费云版)

1. 打开 https://cloud.umami.is 注册账号(免费版够个人博客用)。
2. 添加网站,域名填 `tsla2000.github.io`,拿到一串 **Website ID**。
3. 打开 `docs/.vitepress/config.ts`,找到 `head` 数组里注释掉的 Umami 那行:
   ```ts
   // ['script', { defer: '', src: 'https://cloud.umami.is/script.js', 'data-website-id': '你的-UMAMI-WEBSITE-ID' }],
   ```
   把 `'你的-UMAMI-WEBSITE-ID'` 换成你的真实 ID,删掉行首的 `//`。
4. 提交并推送,部署后访问 Umami 后台即能看到数据。

## 方案 B:Plausible

1. 打开 https://plausible.io 注册(有 30 天试用,之后付费,约 $9/月起)。
2. 添加网站,域名填 `tsla2000.github.io`。
3. 打开 `docs/.vitepress/config.ts`,找到 `head` 数组里注释掉的 Plausible 那行:
   ```ts
   // ['script', { defer: '', 'data-domain': 'tsla2000.github.io', src: 'https://plausible.io/js/script.js' }],
   ```
   删掉行首的 `//` 即可(域名已预填好)。
4. 提交并推送,部署后访问 Plausible 后台即能看到数据。

## 对比

| | Umami | Plausible |
|---|---|---|
| 免费额度 | 云版免费(有事件量上限) | 30 天试用后付费 |
| 自托管 | 可以(自己有服务器的话完全免费) | 可以(开源) |
| 上手难度 | 低 | 低 |

个人博客建议先用 Umami 免费云版,零成本起步。
