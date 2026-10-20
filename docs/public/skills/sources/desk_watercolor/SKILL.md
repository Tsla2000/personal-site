---
name: desk_watercolor
description: >-
  Use when the user wants a warm hand-drawn watercolor illustration: ink and
  wash on cream paper, an amber palette, and one orange accent. For article
  art, X post images, and site illustrations, with short handwritten text
  when asked.
license: MIT
---

# 暖纸水彩插画（Desk Watercolor）

Generate warm hand-drawn watercolor illustrations in the user's reference style: ink and wash on cream paper, amber light, one orange accent. Distilled from the user's reference image on 2026-10-20 (desk by a shoji window, laptop with a rising orange curve, a mango, scattered papers).

## Know the style DNA

- Medium is hand-drawn watercolor plus loose brown ink outlines, with visible brushstrokes and pigment granulation. Nothing looks vector clean or digitally sharp.

- Paper is cream textured watercolor paper, and the grain shows through the whole image including blank areas. The picture ends in rough deckled paper edges, never a hard rectangular crop.

- Palette is warm sepia, amber, ochre and honey brown, with muted olive greens. Everything is desaturated except one accent.

- Accent rule: exactly one saturated warm orange object carries the eye, such as a mango, an orange curve on a screen, or a persimmon. Two accents already break the style.

- Light is soft late-afternoon sun through a lattice or shoji window, with long gentle shadows and a backlit glow.

- Mood is quiet, nostalgic and lived-in. Objects sit slightly scattered, like a real desk mid-work, not staged.

## Compose the prompt

- Build the prompt in this order: style anchor, scene, accent, light, exclusions.

- Use this style anchor verbatim at the start: Hand-drawn watercolor and ink illustration on textured cream watercolor paper, loose brown ink outlines, visible brushstrokes and pigment granulation, warm sepia and amber palette with muted olive greens, rough deckled paper edges.

- Describe the scene in one or two sentences: the desk or setting, the main objects, and what shows outside the window (tiled rooftops, trees, hills).

- Name the single orange accent explicitly, for example: one ripe mango in warm orange as the only saturated color in the image.

- Add the light line: soft late-afternoon sunlight streaming through a lattice window, long gentle shadows.

- End with exclusions: no photorealism, no 3D render, no neon colors, no sharp digital edges. Text is not excluded by default; it follows the next rule.

## Handle text per request, never by style rule

- Leave text out when the user does not ask for any. Blank papers, books and screens keep the illustration clean.

- Include text when the user asks for it, as with WeChat article illustrations that carry a note, a label or a sign. Put the exact characters in quotes inside the prompt, keep them short (a few characters to one short line), and say where they sit: handwritten on the notebook page, on a paper note pinned by the window, on a book spine or a small wooden sign.

- Handwritten-style Chinese fits this watercolor look best. Ask for brush or pencil handwriting, not printed type, unless the user wants a printed label.

- Verify requested text character by character on the result, the same discipline as cover_image_gen. Regenerate any image with a wrong, missing or garbled character instead of delivering it.

## Use a reference image when one exists

- Pass the user's reference image as a `kind: image` entry before the text entry when the user supplies one or asks to match an earlier result. The pipeline reads style from it well.

- Continue an earlier result with its `snapshot_id` as `resume_from_snapshot_id` when the user only changes the scene or the time of day, and describe only the change.

## Verify every result

- Read each generated image with `muse.read` before showing it to the user.

- Check the palette stayed warm and muted, with only one orange accent. Regenerate when a second saturated color sneaks in.

- Check the paper texture and deckled edges are present. A clean white background or hard crop means the anchor got lost, so regenerate with the anchor repeated.

- Check text against the request. When text was requested, confirm every character matches; when none was requested, regenerate any image that invents stray lettering on screens, books or papers.

## Choose the right job for this skill

- Use this skill for article illustrations (including WeChat ones, with or without a short handwritten note), X post images, and website decorative art.

- Use cover_image_gen instead when the image is a cover built around a large Chinese title. Big display typography is that skill's job; this style carries small hand-written text, not headline type.

- Convert to JPG before delivering for WeChat. WeChat rejects WebP uploads, while the website takes either.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.
