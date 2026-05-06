// Generates branded PNG icons + screenshots for PWA manifest using pure Node (zlib).
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// Render a function (x,y)=>[r,g,b,a] into a PNG Buffer.
function makePng(w, h, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0;
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      const off = y * (1 + w * 4) + 1 + x * 4;
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b; raw[off + 3] = a;
    }
  }
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const BG = [4, 5, 13, 255];        // #04050d
const LIME = [200, 255, 0, 255];   // #C8FF00
const WHITE = [255, 255, 255, 255];

function iconPixel(size, safe) {
  // safe=true → keep glyph inside 80% safe zone (for maskable)
  const cx = size / 2, cy = size / 2;
  const inset = safe ? size * 0.1 : 0;
  return (x, y) => {
    if (x < inset || y < inset || x >= size - inset || y >= size - inset) return BG;
    // Rounded square already implicit via background fill.
    // Draw a stylized "T" + dot (TrackLynk mark)
    const r = size / 2 - inset;
    const dx = x - cx, dy = y - cy;
    // T crossbar
    const barW = r * 1.0, barH = r * 0.22;
    const stemW = r * 0.22, stemH = r * 1.1;
    const barTop = -r * 0.55;
    if (Math.abs(dx) <= barW / 2 && dy >= barTop && dy <= barTop + barH) return LIME;
    if (Math.abs(dx) <= stemW / 2 && dy >= barTop && dy <= barTop + stemH) return LIME;
    // accent dot
    const ddx = dx - r * 0.45, ddy = dy - r * 0.55;
    if (ddx * ddx + ddy * ddy <= (r * 0.12) ** 2) return LIME;
    return BG;
  };
}

function screenshotPixel(w, h, label) {
  return (x, y) => {
    // top bar
    if (y < h * 0.08) return [10, 12, 24, 255];
    // brand stripe
    if (y >= h * 0.08 && y < h * 0.085) return LIME;
    // hero band
    if (y < h * 0.45) {
      const t = (y - h * 0.08) / (h * 0.37);
      const r = Math.round(4 + (20 - 4) * t);
      const g = Math.round(5 + (24 - 5) * t);
      const b = Math.round(13 + (40 - 13) * t);
      return [r, g, b, 255];
    }
    // card area
    return BG;
  };
}

const outIcons = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outIcons, { recursive: true });

fs.writeFileSync(path.join(outIcons, '192.png'), makePng(192, 192, iconPixel(192, false)));
fs.writeFileSync(path.join(outIcons, '512.png'), makePng(512, 512, iconPixel(512, false)));
fs.writeFileSync(path.join(outIcons, '512-maskable.png'), makePng(512, 512, iconPixel(512, true)));

const outShots = path.join(__dirname, '..', 'public', 'screenshots');
fs.mkdirSync(outShots, { recursive: true });
fs.writeFileSync(path.join(outShots, 'mobile.png'), makePng(540, 960, screenshotPixel(540, 960)));
fs.writeFileSync(path.join(outShots, 'wide.png'), makePng(1280, 720, screenshotPixel(1280, 720)));

console.log('PWA assets generated.');
