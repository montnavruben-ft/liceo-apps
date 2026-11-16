---
name: physioverse-reel-production
description: Create science/health education reels with reliable research, cohesive 3D assets, user-supplied or generated Latin American Spanish voiceover, karaoke captions, Remotion rendering, and GitHub deliveries.
---
# Physioverse Reel Production Workflow

## Goal
Create a publishable 9:16 educational reel with the fewest approval rounds and no hardcoded captions in visual assets. The script, audio and scene timing must share a single source of truth.

## Stages
1. **Research and approve script.** Verify all medical claims against the supplied sources, avoid unsupported therapeutic guarantees, then save a structured scene script with the actual narration and source attribution.
2. **Voice first.** Select one Spanish Latin American voice (prefer es-MX) and create an initial voice sample. Produce each scene as a separate clip or accept an M4A from the user. Extract exact speech intervals, detect pauses, and build a timing manifest. Determine scene durations from speech length plus a brief 0.3–0.8 s visual pause, not from arbitrary 80-second targets.
3. **Visual art direction.** Approve a single character sheet and a representative frame. Generate 1350×2400 full-bleed visuals with consistent matte porcelain faceless characters, navy/cyan/coral palette. No baked-in titles, subtitles, logos, frames, or opaque cutout rectangles.
4. **Layers only when useful.** Provide backgrounds with properly repaired occlusions; RGBA silhouettes must follow characters. Pure-light layers should be opaque against #000000 and composited with Screen. Register layers to one base scene; reject empty placeholders and mismatched nervous-system overlays.
5. **Early QA.** Check hand contacts, limb anatomy, nerve registration, safe title zones, dimensions and image transparency before rendering. If a complex body pose fails, recompose that scene rather than attempting to repair the entire MP4.
6. **Build in Remotion.** Animate camera, parallax and glow from source images. Generate karaoke subtitles with accurate word timestamps: white text, cyan active word and optional coral emphasis. Render captions once, at the very end. Never burn subtitles into source assets and never mask previously burned subtitles using a black rectangle: re-render from clean sources.
7. **Preview then final.** Create a low-bitrate 720p preview and review all scenes, especially joins, interaction and closing overlay. After approval render a 1080×1920 H.264/AAC MP4. Use ffprobe to verify 30fps, duration, audio and video tracks.
8. **GitHub delivery.** Keep scripts, image layers, source audio and configuration in Git; render through GitHub Actions. Store routine MP4 output as downloadable Actions artifacts, and publish approved final deliverables to Releases. Avoid committing binary revisions on every review.

## Repository layout
- `bobath-reel/src/data/script.json`: scene timing and copy
- `bobath-reel/src/audio/narracion/escena-XX.mp3`: scene narration
- `bobath-reel/public/eXX/`: visual assets
- `bobath-reel/tools/reel-pipeline/`: this skill and validation helpers
- `.github/workflows/physioverse-reel-render.yml`: on-demand render

## Efficiency policy
Batch research and approval; create one art-direction sample; avoid per-frame user approvals; correct scene sources rather than editing final video; generate audio before setting scene lengths; generate one preview before high-quality render. Share a precise deliverable checklist and explicit limitations. Reuse files from the same Git revision and never rely on transient sandbox links as the sole copy.

## Limitations and safety
A rendered MP4 is not editable source. Never claim a video was uploaded or rendered unless the action was verified. Never expose tokens or speech API keys in the repository; use Actions Secrets. A workflow_dispatch workflow is shown in the Actions UI when it exists on the repository's default branch.
