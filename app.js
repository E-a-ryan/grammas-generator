// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BORDER = 216;
const TYPE_INSET = 72;        // distance from inner border edge to the top/bottom slot line
const FONT_FAMILY = '"Foundry Gridnik Bold"';

const TEXT_SIZES = { S: 86, M: 115, L: 230 };
const LINE_HEIGHT_RATIO = 1.0;
const LETTER_SPACING_RATIO = 7 / 144; // tracking stays proportional across sizes
const TEXT_BLUR_RATIO = (3 / 48) * 0.75; // ~25% less blur than the original pass
const TEXT_THRESHOLD = 120;              // 0-255 alpha cutoff after the blur

const RATIOS = {
  "4x5":  { w: 2160, h: 2700 },
  "1x1":  { w: 2160, h: 2160 },
  "9x16": { w: 2160, h: 3840 },
};

// Add more hex colors here to grow the swatch set.
const BORDER_COLORS = [
  "#f665ed",
  "#c3a132",
  "#fc7575",
  "#a5dacb",
];

const BACKGROUNDS = [
  "backgrounds/GT__0005_Illustration_1.jpg",
  "backgrounds/GT__0004_Illustration_2.jpg",
  "backgrounds/GT__0003_Illustration_3.jpg",
  "backgrounds/GT__0002_Illustration_4.jpg",
  "backgrounds/GT__0001_Illustration_5.jpg",
  "backgrounds/GT__0000_Illustration_6.jpg",
  "backgrounds/GT__0000_Illustration_7.png",
];

// Always-on grain overlay. Lives in backgrounds/ but is never offered as a
// pickable background — it's silently multiplied on top of every post.
const TEXTURE_SRC = "backgrounds/TEXTURE.png";

// maxWidth is the ceiling for that logo at 100% on the scale slider.
// The two wordmark lockups can grow wide; the round badge maxes out smaller
// so it doesn't blow past the card.
const LOGOS = [
  { name: "Centered", src: "logo/GT_Logo_Centered_Black.svg", maxWidth: 1944 },
  { name: "Main",     src: "logo/GT_Logo_Main_Black.svg",     maxWidth: 1944 },
  { name: "Badge",    src: "logo/GT_Logo_Badge_Black.svg",    maxWidth: 972 },
];
const LOGO_MAX_WIDTH = Object.fromEntries(LOGOS.map((l) => [l.src, l.maxWidth]));

const ICONS = {
  visible: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  hidden: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z",
  drag: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

// Layer order maps straight onto the three slots: index 0 = top,
// 1 = center, 2 = bottom. Drag a layer to move it between slots.
// Each mode starts from its own layer arrangement. Every mode keeps its own
// copy, so switching modes and back doesn't wipe what you typed.
const MODE_PRESETS = {
  illo: [
    { id: "text1", type: "text", name: "Text", content: "151 MESEROLE", size: "S", visible: true },
    { id: "logo",  type: "logo", name: "Logo", src: LOGOS[0].src, scale: 100, visible: true },
    { id: "text2", type: "text", name: "Text", content: "BROOKLYN, NY", size: "S", visible: true },
  ],
  photo: [
    { id: "text1", type: "text", name: "Text", content: "151 MESEROLE", size: "S", visible: false },
    { id: "logo",  type: "logo", name: "Logo", src: LOGOS[0].src, scale: 100, visible: false },
    { id: "text2", type: "text", name: "Text", content: "CAPTION GOES HERE", size: "S", visible: true },
  ],
  text: [
    { id: "text1", type: "text", name: "Text", content: "151 MESEROLE • BROOKLYN NY", size: "S", visible: true },
    { id: "text2", type: "text", name: "Text", content: "MAIN MESSAGE GOES HERE", size: "L", visible: true },
    { id: "logo",  type: "logo", name: "Logo", src: LOGOS[0].src, scale: 40, visible: true },
  ],
};

const state = {
  ratio: "4x5",
  mode: "illo", // "text" | "illo" | "photo"
  modeLayers: structuredClone(MODE_PRESETS),
  background: BACKGROUNDS[0],
  photo: null,       // prepped canvas of the uploaded photo
  photoToken: 0,     // bumps on each upload, used to invalidate the treatment cache
  treatment: "original", // "original" | "bw" | "duotone"
  borderColor: BORDER_COLORS[0],
};

const SLOTS = ["top", "center", "bottom"];

function currentLayers() {
  return state.modeLayers[state.mode];
}

const imageCache = new Map();
const duotoneCache = new Map();
const bboxCache = new Map();

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const p = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  imageCache.set(src, p);
  return p;
}

// SVGs with no explicit width/height decode at a tiny default intrinsic
// size in <img>/drawImage, which then looks blurry once scaled up onto a
// 2160px canvas. Re-raster at a large explicit size (based on the SVG's
// own viewBox) so the logo stays crisp.
const SVG_RASTER_TARGET = 2400;

async function loadSvgHiRes(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const p = (async () => {
    const text = await fetch(src).then((r) => r.text());
    const viewBoxMatch = text.match(/viewBox="([\d.\-\s]+)"/);
    let w = SVG_RASTER_TARGET, h = SVG_RASTER_TARGET;
    if (viewBoxMatch) {
      const [, , vbW, vbH] = viewBoxMatch[1].trim().split(/\s+/).map(Number);
      const scale = SVG_RASTER_TARGET / Math.max(vbW, vbH);
      w = vbW * scale;
      h = vbH * scale;
    }
    const withSize = text.replace(/<svg /, `<svg width="${w}" height="${h}" `);
    const blob = new Blob([withSize], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = url;
    });
    return img;
  })();
  imageCache.set(src, p);
  return p;
}

// Tight bounding box of the non-transparent pixels, so logo sizing/centering
// is based on the visible artwork, not the SVG's own (often padded) canvas.
async function getBBox(src, img) {
  if (bboxCache.has(src)) return bboxCache.get(src);
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  let minX = c.width, minY = c.height, maxX = 0, maxY = 0, found = false;
  const step = 2;
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      if (data[(y * c.width + x) * 4 + 3] > 10) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const box = found
    ? { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
    : { x: 0, y: 0, w: c.width, h: c.height };
  bboxCache.set(src, box);
  return box;
}

function hexToRgb(hex) {
  const m = hex.replace("#", "");
  return {
    r: parseInt(m.substring(0, 2), 16),
    g: parseInt(m.substring(2, 4), 16),
    b: parseInt(m.substring(4, 6), 16),
  };
}

// Recolor an illustration: black -> border color, white stays white.
async function getDuotone(src, color) {
  const key = src + "|" + color;
  if (duotoneCache.has(key)) return duotoneCache.get(key);

  const img = await loadImage(src);
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const { r, g, b } = hexToRgb(color);
  const id = ctx.getImageData(0, 0, c.width, c.height);
  const data = id.data;
  for (let i = 0; i < data.length; i += 4) {
    const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
    data[i]     = r + (255 - r) * lum;
    data[i + 1] = g + (255 - g) * lum;
    data[i + 2] = b + (255 - b) * lum;
  }
  ctx.putImageData(id, 0, 0);
  duotoneCache.set(key, c);
  return c;
}

// ---------------------------------------------------------------------------
// Uploaded photo
// ---------------------------------------------------------------------------

// Uploads get capped before any pixel work so a 6000px phone photo doesn't
// stall the treatment pass on every render.
const PHOTO_MAX = 2400;

function prepPhoto(img) {
  const scale = Math.min(1, PHOTO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement("canvas");
  c.width = Math.round(img.naturalWidth * scale);
  c.height = Math.round(img.naturalHeight * scale);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return c;
}

const photoCache = new Map();

function getTreatedPhoto(treatment) {
  if (!state.photo) return null;
  const key = `${state.photoToken}|${treatment}|${state.borderColor}`;
  if (photoCache.has(key)) return photoCache.get(key);

  if (treatment === "original") {
    photoCache.set(key, state.photo);
    return state.photo;
  }

  const c = document.createElement("canvas");
  c.width = state.photo.width;
  c.height = state.photo.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(state.photo, 0, 0);

  const id = ctx.getImageData(0, 0, c.width, c.height);
  const d = id.data;
  if (treatment === "bw") {
    for (let i = 0; i < d.length; i += 4) {
      const lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      d[i] = d[i + 1] = d[i + 2] = lum;
    }
  } else {
    // Same shadows->color, highlights->white mapping as the illustrations.
    const { r, g, b } = hexToRgb(state.borderColor);
    for (let i = 0; i < d.length; i += 4) {
      const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
      d[i]     = r + (255 - r) * lum;
      d[i + 1] = g + (255 - g) * lum;
      d[i + 2] = b + (255 - b) * lum;
    }
  }
  ctx.putImageData(id, 0, 0);

  photoCache.set(key, c);
  return c;
}

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------

function drawCover(ctx, img, x, y, w, h) {
  const srcW = img.width || img.naturalWidth;
  const srcH = img.height || img.naturalHeight;
  const srcRatio = srcW / srcH;
  const dstRatio = w / h;
  let sx, sy, sw, sh;
  if (srcRatio > dstRatio) {
    sh = srcH;
    sw = srcH * dstRatio;
    sx = (srcW - sw) / 2;
    sy = 0;
  } else {
    sw = srcW;
    sh = srcW / dstRatio;
    sx = 0;
    sy = (srcH - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

const INK_DARK = "#111111";
const INK_LIGHT = "#ffffff";
const INK_FLIP_THRESHOLD = 0.5; // mean luminance below this -> switch to white

// Averages what's already on the canvas under a given rect so an element can
// pick the ink that will actually read against it. Samples every 16th pixel —
// plenty for a mean, and keeps this cheap enough to run on every render.
function pickInk(ctx, x, y, w, h) {
  const sx = Math.max(0, Math.floor(x));
  const sy = Math.max(0, Math.floor(y));
  const sw = Math.min(ctx.canvas.width - sx, Math.ceil(w));
  const sh = Math.min(ctx.canvas.height - sy, Math.ceil(h));
  if (sw <= 0 || sh <= 0) return INK_DARK;

  const { data } = ctx.getImageData(sx, sy, sw, sh);
  let total = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4 * 16) {
    total += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    count++;
  }
  if (!count) return INK_DARK;
  return total / count / 255 < INK_FLIP_THRESHOLD ? INK_LIGHT : INK_DARK;
}

// Recolors artwork while keeping its alpha — used to flip black assets white.
function tintCanvas(source, color) {
  const c = document.createElement("canvas");
  c.width = source.width || source.naturalWidth;
  c.height = source.height || source.naturalHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(source, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

const whiteLogoCache = new Map();

function getWhiteLogo(src, img) {
  if (!whiteLogoCache.has(src)) whiteLogoCache.set(src, tintCanvas(img, INK_LIGHT));
  return whiteLogoCache.get(src);
}

function drawTrackedText(ctx, text, centerX, y, letterSpacing) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + letterSpacing * (text.length - 1);
  let cursor = centerX - total / 2;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], cursor, y);
    cursor += widths[i] + letterSpacing;
  }
}

function trackedTextWidth(ctx, text, letterSpacing) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  return widths.reduce((a, b) => a + b, 0) + letterSpacing * (text.length - 1);
}

// Breaks a line at word boundaries so it stays inside maxWidth. A single word
// wider than maxWidth is left alone — there's no sensible break point.
function wrapLine(ctx, line, letterSpacing, maxWidth) {
  const words = line.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const out = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (trackedTextWidth(ctx, test, letterSpacing) <= maxWidth) {
      current = test;
    } else {
      out.push(current);
      current = words[i];
    }
  }
  out.push(current);
  return out;
}

// Renders tracked, possibly multi-line text to its own canvas, blurs it, then
// hard-thresholds the alpha back to on/off — a cheap "slightly degraded"
// photocopy-style edge. `edge` is "top" or "bottom": which side of the block
// sits at the pad offset, so the caller can anchor it like plain fillText.
function renderDegradedText(text, fontSizePx, letterSpacing, color, edge, maxWidth) {
  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `700 ${fontSizePx}px ${FONT_FAMILY}`;

  // Hard breaks the user typed, then soft-wrap anything still too wide.
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length)
    .flatMap((l) => wrapLine(measure, l, letterSpacing, maxWidth));
  if (!lines.length) return null;

  const widest = Math.max(...lines.map((l) => trackedTextWidth(measure, l, letterSpacing)));

  const lineHeight = fontSizePx * LINE_HEIGHT_RATIO;
  const blurPx = fontSizePx * TEXT_BLUR_RATIO;
  const pad = Math.ceil(fontSizePx * 0.6 + blurPx * 3);
  const cw = Math.ceil(widest) + pad * 2;
  const ch = Math.ceil(fontSizePx * 1.4 + lineHeight * (lines.length - 1)) + pad * 2;

  const raw = document.createElement("canvas");
  raw.width = cw;
  raw.height = ch;
  const rctx = raw.getContext("2d");
  rctx.font = `700 ${fontSizePx}px ${FONT_FAMILY}`;
  rctx.fillStyle = color;
  rctx.textBaseline = edge === "top" ? "top" : "bottom";
  lines.forEach((line, i) => {
    const y = edge === "top"
      ? pad + i * lineHeight
      : ch - pad - (lines.length - 1 - i) * lineHeight;
    drawTrackedText(rctx, line, cw / 2, y, letterSpacing);
  });

  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  const octx = out.getContext("2d");
  octx.filter = `blur(${blurPx}px)`;
  octx.drawImage(raw, 0, 0);
  octx.filter = "none";

  const id = octx.getImageData(0, 0, cw, ch);
  const data = id.data;
  for (let i = 3; i < data.length; i += 4) {
    data[i] = data[i] > TEXT_THRESHOLD ? 255 : 0;
  }
  octx.putImageData(id, 0, 0);

  return { canvas: out, cw, ch, pad };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

let fontReady = false;

async function ensureFont() {
  if (fontReady) return;
  await document.fonts.load(`700 144px ${FONT_FAMILY}`);
  fontReady = true;
}

function drawTextLayer(ctx, layer, anchor, w, h) {
  const content = layer.content.trim();
  if (!content) return;
  const fontSize = TEXT_SIZES[layer.size];
  const letterSpacing = fontSize * LETTER_SPACING_RATIO;
  const edge = anchor === "bottom" ? "bottom" : "top";
  const t = renderDegradedText(content.toUpperCase(), fontSize, letterSpacing, INK_DARK, edge, w - BORDER * 2);
  if (!t) return;

  let y;
  if (anchor === "top") y = BORDER + TYPE_INSET - t.pad;
  else if (anchor === "bottom") y = h - BORDER - TYPE_INSET - t.ch + t.pad;
  else y = h / 2 - t.ch / 2;

  const x = w / 2 - t.cw / 2;
  let art = t.canvas;
  if (state.mode === "photo" && pickInk(ctx, x, y, t.cw, t.ch) === INK_LIGHT) {
    art = tintCanvas(t.canvas, INK_LIGHT);
  }
  ctx.drawImage(art, x, y);
}

async function drawLogoLayer(ctx, layer, anchor, w, h) {
  const logoImg = await loadSvgHiRes(layer.src);
  const box = await getBBox(layer.src, logoImg);

  const maxW = LOGO_MAX_WIDTH[layer.src] || (w - BORDER * 2);
  const targetW = maxW * (layer.scale / 100);
  const factor = targetW / box.w;
  const drawW = logoImg.naturalWidth * factor;
  const drawH = logoImg.naturalHeight * factor;
  const boxCenterX = (box.x + box.w / 2) * factor;
  const boxCenterY = (box.y + box.h / 2) * factor;
  const boxHalfH = (box.h / 2) * factor;

  let centerY;
  if (anchor === "top") centerY = BORDER + TYPE_INSET + boxHalfH;
  else if (anchor === "bottom") centerY = h - BORDER - TYPE_INSET - boxHalfH;
  else centerY = h / 2;

  const drawX = w / 2 - boxCenterX;
  const drawY = centerY - boxCenterY;

  let art = logoImg;
  if (state.mode === "photo") {
    // Sample only the visible artwork, not the SVG's transparent padding.
    const ink = pickInk(
      ctx,
      drawX + box.x * factor,
      drawY + box.y * factor,
      box.w * factor,
      box.h * factor
    );
    if (ink === INK_LIGHT) art = getWhiteLogo(layer.src, logoImg);
  }

  ctx.drawImage(art, drawX, drawY, drawW, drawH);
}

async function render() {
  const { w, h } = RATIOS[state.ratio];
  const canvas = document.getElementById("stage");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  document.getElementById("dimsLabel").textContent = `${w} × ${h}px`;

  await ensureFont();
  const texture = await loadImage(TEXTURE_SRC);

  // Base + background illustration are full-bleed, edge to edge — the
  // border gets multiplied on top of everything at the very end, so a
  // large logo or the illustration can run underneath it.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  if (state.mode === "illo") {
    const duotoneBg = await getDuotone(state.background, state.borderColor);
    drawCover(ctx, duotoneBg, 0, 0, w, h);
  } else if (state.mode === "photo") {
    const photo = getTreatedPhoto(state.treatment);
    if (photo) drawCover(ctx, photo, 0, 0, w, h);
    // The border multiplies down over whatever sits under it, so a full-color
    // or B&W photo would turn the frame muddy. Duotone just the border band so
    // the border color still reads cleanly.
    if (photo && state.treatment !== "duotone") {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.rect(BORDER, BORDER, w - BORDER * 2, h - BORDER * 2);
      ctx.clip("evenodd");
      drawCover(ctx, getTreatedPhoto("duotone"), 0, 0, w, h);
      ctx.restore();
    }
  }

  // Each layer renders into the slot its position implies. The logo is held
  // back until after the border so it can sit on top of it.
  const layers = currentLayers();
  let logoJob = null;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (!layer.visible) continue;
    const anchor = SLOTS[i];
    if (layer.type === "text") drawTextLayer(ctx, layer, anchor, w, h);
    else logoJob = { layer, anchor };
  }

  // Border, multiplied over the background and text. Drawn as one
  // frame-shaped fill (evenodd) rather than 4 overlapping rects, so the
  // corners don't get multiplied twice and go dark.
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = state.borderColor;
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.rect(BORDER, BORDER, w - BORDER * 2, h - BORDER * 2);
  ctx.fill("evenodd");
  ctx.restore();

  // Logo goes over the border, so a wide logo reads as the topmost element.
  if (logoJob) await drawLogoLayer(ctx, logoJob.layer, logoJob.anchor, w, h);

  // Paper grain last of all, multiplied down over everything — never
  // exposed as a pickable background.
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  drawCover(ctx, texture, 0, 0, w, h);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Layer panel
// ---------------------------------------------------------------------------

function icon(path, cls) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", cls);
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", path);
  svg.appendChild(p);
  return svg;
}

function buildTextControls(layer) {
  const body = document.createElement("div");
  body.className = "layer-body";

  const area = document.createElement("textarea");
  area.className = "layer-input";
  area.rows = 2;
  area.value = layer.content;
  area.placeholder = "Type here — Return for a second line";
  area.addEventListener("input", (e) => {
    layer.content = e.target.value;
    render();
  });
  body.appendChild(area);

  const seg = document.createElement("div");
  seg.className = "segmented small";
  ["S", "M", "L"].forEach((size) => {
    const btn = document.createElement("button");
    btn.textContent = size;
    if (layer.size === size) btn.classList.add("active");
    btn.addEventListener("click", () => {
      layer.size = size;
      seg.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
    seg.appendChild(btn);
  });
  body.appendChild(seg);

  return body;
}

function buildLogoControls(layer) {
  const body = document.createElement("div");
  body.className = "layer-body";

  const row = document.createElement("div");
  row.className = "thumb-row";
  LOGOS.forEach((logo) => {
    const btn = document.createElement("button");
    btn.className = "thumb logo-thumb";
    btn.style.backgroundImage = `url(${logo.src})`;
    if (logo.src === layer.src) btn.classList.add("selected");
    btn.title = logo.name;
    btn.addEventListener("click", () => {
      layer.src = logo.src;
      row.querySelectorAll(".thumb").forEach((t) => t.classList.remove("selected"));
      btn.classList.add("selected");
      render();
    });
    row.appendChild(btn);
  });
  body.appendChild(row);

  const scaleRow = document.createElement("div");
  scaleRow.className = "scale-row";
  const scaleLabel = document.createElement("span");
  scaleLabel.className = "scale-label";
  scaleLabel.textContent = `${layer.scale}%`;
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 20;
  slider.max = 100;
  slider.value = layer.scale;
  slider.addEventListener("input", (e) => {
    layer.scale = Number(e.target.value);
    scaleLabel.textContent = `${layer.scale}%`;
    render();
  });
  scaleRow.appendChild(slider);
  scaleRow.appendChild(scaleLabel);
  body.appendChild(scaleRow);

  return body;
}

let dragIndex = null;

function buildLayerPanel() {
  const list = document.getElementById("layerList");
  list.innerHTML = "";

  currentLayers().forEach((layer, index) => {
    const row = document.createElement("div");
    row.className = "layer" + (layer.visible ? "" : " hidden-layer");
    row.dataset.index = index;

    const head = document.createElement("div");
    head.className = "layer-head";

    const eye = document.createElement("button");
    eye.className = "eye-btn";
    eye.title = layer.visible ? "Hide layer" : "Show layer";
    eye.appendChild(icon(layer.visible ? ICONS.visible : ICONS.hidden, "mi"));
    eye.addEventListener("click", () => {
      layer.visible = !layer.visible;
      buildLayerPanel();
      render();
    });
    head.appendChild(eye);

    const name = document.createElement("span");
    name.className = "layer-name";
    name.textContent = layer.name;
    head.appendChild(name);

    const slot = document.createElement("span");
    slot.className = "layer-slot";
    slot.textContent = SLOTS[index];
    head.appendChild(slot);

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.title = "Drag to reorder";
    handle.appendChild(icon(ICONS.drag, "mi"));
    // Only arm dragging from the handle, so text selection inside the
    // layer's own inputs still works normally.
    handle.addEventListener("mousedown", () => { row.draggable = true; });
    handle.addEventListener("mouseup", () => { row.draggable = false; });
    head.appendChild(handle);

    row.appendChild(head);
    row.appendChild(layer.type === "text" ? buildTextControls(layer) : buildLogoControls(layer));

    row.addEventListener("dragstart", (e) => {
      dragIndex = index;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => {
      row.draggable = false;
      row.classList.remove("dragging");
      list.querySelectorAll(".layer").forEach((r) => r.classList.remove("drop-target"));
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndex !== index) row.classList.add("drop-target");
    });
    row.addEventListener("dragleave", () => row.classList.remove("drop-target"));
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      row.classList.remove("drop-target");
      const from = dragIndex ?? Number(e.dataTransfer.getData("text/plain"));
      if (from === null || from === index) return;
      const layers = currentLayers();
      const [moved] = layers.splice(from, 1);
      layers.splice(index, 0, moved);
      dragIndex = null;
      buildLayerPanel();
      render();
    });

    list.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Global controls
// ---------------------------------------------------------------------------

function buildRatioPicker() {
  const el = document.getElementById("ratioPicker");
  el.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.ratio = btn.dataset.ratio;
      el.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
  });
}

function syncModeFields() {
  document.getElementById("illoField").hidden = state.mode !== "illo";
  document.getElementById("photoField").hidden = state.mode !== "photo";
}

function buildModePicker() {
  const el = document.getElementById("modePicker");
  el.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode;
      el.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      syncModeFields();
      buildLayerPanel();
      render();
    });
  });
  syncModeFields();
}

function buildTreatmentPicker() {
  const el = document.getElementById("treatmentPicker");
  el.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.treatment = btn.dataset.treatment;
      el.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
  });
}

function wirePhotoUpload() {
  document.getElementById("photoInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        state.photo = prepPhoto(img);
        state.photoToken += 1;
        photoCache.clear();
        document.getElementById("photoStatus").textContent = file.name;
        render();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function buildBgPicker() {
  const el = document.getElementById("bgPicker");
  BACKGROUNDS.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.className = "thumb";
    btn.style.backgroundImage = `url(${src})`;
    if (src === state.background) btn.classList.add("selected");
    btn.title = `Background ${i + 1}`;
    btn.addEventListener("click", () => {
      state.background = src;
      el.querySelectorAll(".thumb").forEach((t) => t.classList.remove("selected"));
      btn.classList.add("selected");
      render();
    });
    el.appendChild(btn);
  });
}

function buildColorPicker() {
  const el = document.getElementById("colorPicker");
  BORDER_COLORS.forEach((color) => {
    const btn = document.createElement("button");
    btn.className = "thumb color-thumb";
    btn.style.background = color;
    if (color === state.borderColor) btn.classList.add("selected");
    btn.title = color;
    btn.addEventListener("click", () => {
      state.borderColor = color;
      el.querySelectorAll(".thumb").forEach((t) => t.classList.remove("selected"));
      btn.classList.add("selected");
      render();
    });
    el.appendChild(btn);
  });
}

function wireGlobals() {
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const canvas = document.getElementById("stage");
    const link = document.createElement("a");
    const firstText = currentLayers().find((l) => l.type === "text" && l.visible && l.content.trim());
    const slug = (firstText ? firstText.content : "post")
      .trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    link.download = `grammas-tavern-${state.ratio}-${slug || "post"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

async function init() {
  buildModePicker();
  buildRatioPicker();
  buildBgPicker();
  buildColorPicker();
  buildTreatmentPicker();
  buildLayerPanel();
  wirePhotoUpload();
  wireGlobals();
  await render();
}

init();
