# UI 设计参考清单（8 类 · 60+）

来源说明：条目整理自 PamelaAI·H（@pamelaaaaa1218）公开文章《从0搭建个人网站：8大类60+UI设计必备清单》（X，2026-10）。用法改写成 Agent 可执行提示；链接为公开站点，商用前请自行核对授权与维护状态。

## 怎么用这份清单

1. 先定网站气质与技术栈，再从对应品类各挑 1–3 个参考，不要一次全上。
2. 让 AI 接入前检查：框架是否匹配、是否可商用、是否仍在维护。
3. 付费库（如 Tailwind Plus）未购买则只作视觉参考，不要让 AI 抓付费源码。
4. 改名/合并过的入口已在备注里标出；优先打开「现用」链接。

## 02 组件

| 名称 | URL | 用法要点 |
|---|---|---|
| shadcn/ui | https://ui.shadcn.com/ | 基础组件、源码可改；选组件后把安装说明交给 AI，统一颜色/圆角/尺寸 |
| Aceternity UI | https://ui.aceternity.com/ | 立体卡片、光效；先预览再替换素材并调强弱 |
| Magic UI | https://magicui.design/ | React+Tailwind 文字动画、数字滚动、动态边框 |
| React Bits | https://reactbits.dev/ | 文字/背景动画，参数可调；控制依赖与速度 |
| Cult UI | https://cult-ui.com/ | 设备模型与作品卡片（围绕 shadcn） |
| KokonutUI | https://kokonutui.com/ | 交互组件、AI 界面区块 |
| HyperUI | https://hyperui.dev/ | Tailwind 营销与应用区块，复制后接入 |
| Float UI | https://floatui.com/ | HTML/React/Vue 多版本；检查手机排版 |
| Park UI | https://park-ui.com/ | Ark UI + Panda CSS；先查与现有栈兼容性 |
| Tailwind UI / Plus | https://tailwindui.com/ · https://tailwindcss.com/plus | 官方付费区块；预览后按方案获取 |
| shadcn blocks | https://ui.shadcn.com/blocks | 官方侧栏/登录/后台区块 |
| shadcnblocks.com | https://www.shadcnblocks.com/ | 第三方营销区块（首屏、功能、价格、评价） |
| 21st.dev | https://21st.dev/ | 组件+区块+提示词；复制提示词并补自己的内容 |
| Origin UI → coss ui | https://originui.com/ · https://coss.com/ui | Base UI 组件；补齐禁用/报错/加载态 |
| Skiper UI | https://skiper-ui.com/ | 图片揭示、拖动、滚动、鼠标跟随 |

## 03 动效与 3D

| 名称 | URL | 用法要点 |
|---|---|---|
| Motion | https://motion.dev/ | 淡入、拖拽、布局过渡；控制速度与幅度 |
| GSAP | https://gsap.com/ | 时间轴与滚动联动；先写清触发顺序 |
| Anime.js | https://animejs.com/ | JS/SVG 动画；替换目标元素与曲线 |
| LottieFiles | https://lottiefiles.com/ | 矢量反馈动画；按技术栈选播放器 |
| Shadertoy | https://www.shadertoy.com/ | 着色器灵感；查授权后再做网页适配 |
| The Book of Shaders | https://thebookofshaders.com/ | 着色器入门；改参数后交给 AI 落地 |
| Three.js Examples | https://threejs.org/examples | 官方 3D 示例；先小场景再嵌入 |
| Spline | https://spline.design/ | 可视化 3D + Viewer 嵌入 |
| Rive | https://rive.app/ | 状态机交互动画；把网页事件接到输入 |

## 04 整站灵感

| 名称 | URL | 用法要点 |
|---|---|---|
| Godly → Recent | https://godly.website/ · https://recent.design/ | 创意站；挑 2–3 例记字体/配色/首屏 |
| Land-book | https://land-book.com/ | 按行业/风格筛选；缺单块看 Sections |
| Lapa Ninja | https://www.lapa.ninja/ | 落地页合集；对比标题/配图/按钮 |
| One Page Love | https://onepagelove.com/ | 单页/作品集；列出内容顺序再替换 |
| SaaS Landing Page | https://saaslandingpage.com/ | 拆问题→用法→证明→下一步 |
| httpster | https://httpster.net/ | 大图独立站气质 |
| Awwwards | https://www.awwwards.com/ | 打开真站，描述「什么操作触发什么变化」 |
| CSS Design Awards | https://www.cssdesignawards.com/ | 选一个细节写清触发条件做小样 |
| SiteInspire | https://www.siteinspire.com/ | 比较字号、网格、图片比例 |
| Minimal Gallery | https://minimal.gallery/ | 截图标出层级与留白 |
| MotionSites | https://motionsites.ai/ | AI 网页提示词；补品牌与技术要求 |
| Variant | https://variant.fun/ | 风格探索；若打不开可改用 Google Stitch |

## 05 产品界面与流程

| 名称 | URL | 用法要点 |
|---|---|---|
| Mobbin | https://mobbin.com/ | 真实产品界面检索（登录/订阅等） |
| Page Flows | https://pageflows.com/ | 操作录屏；写下入口→操作→反馈→下一步 |
| screenlane | https://screenlane.com/ | 旧入口，已并入 Page Flows |
| UI Sources → ScreensDesign | https://www.uisources.com/ · https://screensdesign.com/ | App 界面与流程录屏 |
| Refero | https://refero.design/ | 网页/App 信息布局与层级 |

## 06 局部灵感与微交互

| 名称 | URL | 用法要点 |
|---|---|---|
| CodePen | https://codepen.io/ | Fork 改色/速度，把代码与依赖交给 AI |
| Codrops | https://tympanus.net/codrops | 交互教程；先独立小样再嵌入 |
| UI Movement | https://uimovement.com/ | 旧名，现看 Page Flows |
| Dribbble | https://dribbble.com/ | 构图灵感，通常无代码 |
| Behance | https://www.behance.net/ | 完整品牌项目，提炼规则 |

## 07 配色、图标与素材

| 名称 | URL | 用法要点 |
|---|---|---|
| CSS Gradient | https://cssgradient.io/ | 调渐变并复制 CSS |
| uiGradients | https://uigradients.com/ | 现成渐变预览 |
| Coolors | https://coolors.co/ | 生成搭配或从图片取色 |
| Realtime Colors | https://realtimecolors.com/ | 在示例页试配色/字体与对比度 |
| TweakCN | https://tweakcn.com/ | shadcn 主题可视化 |
| Hero Patterns | https://heropatterns.com/ | SVG 纹理背景 |
| Heroicons | https://heroicons.com/ | Tailwind 团队 SVG 图标 |
| Lucide | https://lucide.dev/ | 线性图标，全站粗细一致 |
| Phosphor Icons | https://phosphoricons.com/ | 多字重图标 |
| unDraw | https://undraw.co/ | 可改主色的场景插画 |
| Storyset | https://storyset.com/ | 可改色/加动画的插画 |
| Pexels | https://www.pexels.com/ | 照片与视频 |
| Unsplash | https://unsplash.com/ | 氛围摄影 |

## 08 AI 生成界面与建站

| 名称 | URL | 用法要点 |
|---|---|---|
| v0 | https://v0.dev/ | 写清职业/访客/作品并附参考图，再逐项改 |
| Lovable | https://lovable.dev/ | 对话建站；加表单并测提交 |
| Bolt.new | https://bolt.new/ | 浏览器内生成运行；逐页点检后发布 |
| Google Stitch | https://stitch.withgoogle.com/ | 方案探索与原型 |
| Figma Make | https://www.figma.com/make | 提示词做可交互原型 |
| Subframe | https://www.subframe.com/ | 画布 + 预览 + 编码代理 |
| Galileo AI | https://www.usegalileo.ai/ | 旧入口，现转 Google Stitch |

## 09 设计 Skill 与提示词

| 名称 | URL | 用法要点 |
|---|---|---|
| UI Skills 目录 | https://www.ui-skills.com/skills | 按字体/动画/布局查找并安装 Skill |
| Anthropic frontend-design | https://github.com/anthropics/skills/tree/main/skills/frontend-design | 官方前端设计 Skill（商店另有完整包） |
| pbakaus / Impeccable | https://github.com/pbakaus · https://impeccable.style/ | `npx impeccable install` 后做设计审查与精修 |
| z1han 提示词库 | https://ai.z1han.com/prompt | 借鉴提示词结构，换成自己的品牌与约束 |
