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

## Umami 后台检查

1. 打开 https://cloud.umami.is 并登录。
2. 确认网站的域名设置为 `promangofund.com`，且 Website ID 与 `docs/.vitepress/config.ts` 中的脚本配置对应。
3. 部署后打开技能目录，试用一次复制和一次 ZIP 下载。
4. 在 Umami 的事件报告中确认出现 `skill_view`、`skill_copy` 和 `skill_download`。
5. 若没有事件，检查浏览器控制台、内容拦截器和 Umami 域名配置；不要为排查问题把用户内容发送给分析服务。

## 隐私与数据边界

这里只收集产品使用事件，不追踪用户输入内容，也不需要登录才能复制或下载。若将来增加账户、订单或在线执行，应重新评估隐私告知、数据保留周期、访问权限与用户删除请求。
