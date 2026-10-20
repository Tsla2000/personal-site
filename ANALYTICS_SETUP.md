# 网站流量与技能使用统计

当前网站已接入 Umami Cloud 脚本，统计域名应配置为正式域名 `promangofund.com`。脚本配置位于 `docs/.vitepress/config.ts`。如果 Umami 后台尚未将该域名添加到对应 Website，请先在 Umami 中确认。

## 当前记录的事件

除了 Umami 默认页面浏览，网站会记录以下产品事件：

| 事件名 | 触发时机 | 用途 |
|---|---|---|
| `skill_view` | 打开技能详情页 | 漏斗第一步；`returning` 区分首次访问与回访 |
| `skill_copy` | 用户点击复制技能 | 观察不同技能的实际使用意向 |
| `skill_download` | 用户点击下载 ZIP | 观察下载需求与语言差异 |

公共属性：`skill_id`、`language`（zh / en）。`skill_copy`、`skill_download` 另带 `source`（home / catalog / detail，表示在首页、技能目录还是详情页点的），`skill_copy` 另带 `result`（success / failed）。

回访标记只在访客本机的 localStorage（`pmf:viewed-skills`）记录看过的技能 ID，只上报 true / false，不生成也不上报任何用户标识。

事件属性只包含技能 ID、语言、来源和复制成功/失败状态，不发送用户输入、剪贴板内容、文件内容、API 密钥或个人身份信息。分析脚本被拦截或加载失败时，复制和下载仍应正常工作。

## 建议先观察哪些指标

- **自然搜索点击与查询词：** 在 Google Search Console 中查看搜索需求和页面表现。
- **技能页访问：** 识别能带来搜索流量的主题。
- **复制率：** 复制事件数 / 对应技能页访问数。该值是方向性指标，需考虑重复操作。
- **下载率：** ZIP 下载事件数 / 对应技能页访问数。
- **语言和主题差异：** 判断中文与英文页面分别有哪些实际需求。

不要只根据单日波动做决策。新页面需要时间被发现和收录；先建立基线，再按周观察趋势。

## 技能漏斗怎么看

详情页 `skill_view` → `skill_copy` / `skill_download`（source=detail）→ `skill_view`（returning=true）。

在 Umami 的 Funnel 报告里按上面三步建漏斗，或在 Events 里按 `skill_id` 拆分。读法：

- **访问多、复制下载少：** 详情页的介绍、示例或使用门槛有问题，优先改页面。
- **访问少、复制率高：** 需求真实但曝光不足，优先做搜索关键词和内链。
- **回访比例高：** 说明是会反复用的技能，适合出进阶版或配套文章。
- **source=home/catalog 占比高：** 很多人不看详情就直接复制，详情页转化率要结合这部分一起看。

样本很少时（单个技能周访问不到几十次）比例没有意义，先看绝对数和趋势。

## 站内分渠道统计（v2）

除 Umami 外，站内自建了一套轻量统计（`functions/api/hit.ts`、`functions/api/stats.ts`，前端埋点在 `docs/.vitepress/theme/index.ts`），日报按渠道拆分。

| 指标 | 来源 | 口径 |
|---|---|---|
| 有效访问 | 站内自动 | 落地页停留 ≥10 秒且滚动 ≥25%，刷一下就走的不计 |
| 激活用户 | 站内自动 | 点「觉得有用」/收藏/订阅，按访客去重 |
| 留存 | 站内自动 | 匿名访客 ID + 首触渠道，回访记到首次来的渠道；样本够时给 7 日留存率 |
| 曝光量 | 站外手工 | 公众号阅读数、X 浏览量、搜索展示，按周记台账 `ledger.csv` |
| 付费用户 | 手工对账 | 按周核对实际赞助笔数；支付侧无法带渠道，只能用赞助页分渠道访问量做代理 |

渠道取值：`wechat` / `x` / `search` / `github` / `direct` / `other`，或净化后的 `utm_source` 原值。

### 站长排除

在每个常用浏览器打开一次 `https://promangofund.com/?pm_owner=1`，之后该浏览器的访问全部不计数。`?pm_owner=0` 可取消。

### 站外链接必须带 UTM

- `utm_source`：`wechat` / `x` 等
- `utm_medium`：链接位置（如文末、置顶）
- `utm_campaign`：文章 slug

例：`https://promangofund.com/?utm_source=wechat&utm_medium=footer&utm_campaign=my-post`。不带参数时微信内打开会归到「直接访问」，归因丢失。**更省事的做法：**

- 生成页 `https://promangofund.com/utm`：选渠道和位置，粘贴文章链接，一键复制带参数的链接；`campaign` 留空时取文章 slug。页面已 noindex。
- 短链（微信文末兜底）：`/wx/<站内路径>` 302 到 `<路径>?utm_source=wechat&utm_medium=short`，`/x/<站内路径>` 同理，只写 `/wx`、`/x` 回首页。短链不带 `utm_campaign`，只能分到渠道级。规则在 `docs/public/_redirects`。

完整规范见 Muse 侧 `~/workspace/site-stats/channels.md`。

## Umami 后台检查

1. 打开 https://cloud.umami.is 并登录。
2. 确认网站的域名设置为 `promangofund.com`，且 Website ID 与 `docs/.vitepress/config.ts` 中的脚本配置对应。
3. 部署后打开技能目录，试用一次复制和一次 ZIP 下载。
4. 在 Umami 的事件报告中确认出现 `skill_view`、`skill_copy` 和 `skill_download`。
5. 若没有事件，检查浏览器控制台、内容拦截器和 Umami 域名配置；不要为排查问题把用户内容发送给分析服务。

## 隐私与数据边界

这里只收集产品使用事件，不追踪用户输入内容，也不需要登录才能复制或下载。若将来增加账户、订单或在线执行，应重新评估隐私告知、数据保留周期、访问权限与用户删除请求。


## 技能热度排行

首页技能商店和技能目录的「热门」按真实热度排序，页面不显示任何数字。

- 数据：`skill_view` / `skill_copy`（成功）/ `skill_download` / `skill_like` 发生时，`analytics.ts` 会同步一条第一方统计（`/api/hit`，`t=skill`），累计到 KV `skill:<id>`。同一访客同一技能同一动作每天只计 1 次，站长自测（`?pm_owner=1`）不计。
- 热度分 = 浏览×1 + 复制×3 + 下载×3 + 觉得有用×5，权重在 `functions/api/skill-rank.ts`。
- 读取：`GET /api/skill-rank` 返回 `{scores:{技能id:分}}`，缓存 5 分钟。
- 回退：全站热度总分不足 30（`SKILL_HEAT_MIN_TOTAL`）、接口不可用或在镜像站时，保持编辑推荐顺序。
- 上线前的历史数据（Umami 里的）不会回填，排行从上线后开始累计。
