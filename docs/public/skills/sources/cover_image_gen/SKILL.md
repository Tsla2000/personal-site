---
name: cover_image_gen
description: >-
  Use when the user wants a website or WeChat/公众号 cover image, or an X post
  cover in 3D paper-craft / clay style with Chinese title typography. Generate
  3 composition variants, verify every Chinese character, deliver JPG.
license: MIT
---

# Cover Image Generator（Grok Bot 适配）

为 @PRO_AI_99T / 「PRO的茶里芒果」锁定风格：3D 纸雕与黏土渲染，鲜亮活泼，中文标题大字排版。

## 写提示词（三段，按顺序）

1. **风格锚点**：3D paper craft and clay render, bright and playful, WeChat article cover composition.
2. **完整中文标题**（单引号包裹）+ 写明哪个词黄底高亮、哪个词黑色加粗。
3. **场景一句**：谁从哪侧撕开纸，露出的卡片上有什么英文短标签（如 Markdown / HTML / GitHub）。

副标题尽量短或不要；太长会挤掉主标题。

## 出图

- 用 Cursor `GenerateImage`（不要用 Muse 的 `media.generate_image`）。
- 同一标题出 **3 版**不同构图：人物在右 / 无人物标题大 / 人物在左。
- 单次响应最多 4 次生图。
- 用户要延续上次风格时，把上一张图作为参考图一起传入（若工具支持）。

## 验收（必做）

- 用 `Read` 打开每张生成图，**逐字**核对中文标题；错字或乱码 → 重生，不交付。
- 检查高亮是否落在指定词，版面是否拥挤。

## 交付

- WebP 转 JPG 再交（微信 uploadimg / add_material 不认 WebP）：
  `python3 -c "from PIL import Image; im = Image.open('in.webp').convert('RGB'); im.save('out.jpg', quality=92)"`
- 文件名区分版本；用 SendToUser attachment 发图，不要塞进列表。

## 和 diagram-design / anatomy 的分工

- 封面、推文大图、公众号头图 → 本 skill
- 架构/流程等图解 → diagram-design
- 等轴测交互解剖图 → anatomy
