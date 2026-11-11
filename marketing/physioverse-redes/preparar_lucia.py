"""Prepara los clips de Lucía y las capturas del video 3 (informe y progreso).
- Recorta las franjas de relleno de cada MP4, extrae cuadros y los amplía a 1080 px.
- Sustituye las pantallas verdes por capturas de la app (con perspectiva si el celular está inclinado).
- Personaliza el portal del paciente con "¡Hola, Lucía!".
Uso: python3 preparar_lucia.py <uploads_dir>"""
import sys, os, subprocess, glob
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

U = sys.argv[1].rstrip('/') + '/'
OUT = 'assets/lucia/'
INF = 'assets/informe/'

def norm(path, dot=False):
    im = Image.open(path).convert('RGB').resize((1188, 2576), Image.LANCZOS)
    if dot:
        ImageDraw.Draw(im).ellipse((372, 57, 420, 105), fill=(0, 0, 0))
    return im

# --- Capturas del video 3 ---
norm(U + '0d1a3347-image.jpg', True).save(INF + 'auditoria.jpg', quality=92)
norm(U + '0ef3174c-image.jpg', True).save(INF + 'progreso.jpg', quality=92)
portal = norm(U + '89aee83e-image.png')
# "¡Hola, Prueba! 👋" -> "¡Hola, Lucía! 👋"
emoji = portal.crop((592, 532, 668, 612))
a = np.asarray(portal).copy()
a[528:620, 100:900] = a[522:523, 100:900]
portal = Image.fromarray(a)
d = ImageDraw.Draw(portal)
font = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf', 70)
d.text((108, 534), '¡Hola, Lucía!', font=font, fill=(255, 255, 255))
w = d.textlength('¡Hola, Lucía!', font=font)
portal.paste(emoji, (int(108 + w + 22), 532))
portal.save(INF + 'portal.jpg', quality=92)

# --- Clips ---
CLIPS = {  # nombre: (archivo, y0, y1)
    'desanimo': ('9ea22bef-lucia_ejercicios_desanimo_720p.mp4', 566, 1280),
    'telefono': ('a88f7187-lucia_reaccion_telefono_720x1080.mp4', 250, 970),
    'banda':    ('bc7419f7-lucia_banda_roja_720x1080.mp4', 300, 1014),
    'despedida': ('97d254ed-lucia_fernando_despedida_720x1080.mp4', 272, 808),
}
SCREEN = {'telefono': portal.crop((0, 110, 1188, 2576)), 'banda': portal.crop((0, 110, 1188, 2576))}

def persp_coeffs(dst, src):
    A, B = [], []
    for (X, Y), (x, y) in zip(dst, src):
        A += [[X, Y, 1, 0, 0, 0, -x * X, -x * Y], [0, 0, 0, X, Y, 1, -y * X, -y * Y]]
        B += [x, y]
    return np.linalg.lstsq(np.array(A, float), np.array(B, float), rcond=None)[0].tolist()

def key(f, scr):
    a = np.asarray(f).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (g > 120) & (g - r > 50) & (g - b > 50)
    if m.sum() < 500:
        return f
    # descartar píxeles verdes sueltos: quedarse con filas/columnas densas
    rows = np.where(m.sum(1) > 12)[0]; cols = np.where(m.sum(0) > 12)[0]
    m2 = np.zeros_like(m); m2[rows.min():rows.max() + 1, cols.min():cols.max() + 1] = True
    m = m & m2
    ys, xs = np.where(m)
    s, dif = xs + ys, xs - ys
    tl = (xs[s.argmin()], ys[s.argmin()]); br = (xs[s.argmax()], ys[s.argmax()])
    tr = (xs[dif.argmax()], ys[dif.argmax()]); bl = (xs[dif.argmin()], ys[dif.argmin()])
    # ampliar un poco el cuadrilátero para cubrir las esquinas redondeadas
    cx, cy = np.mean([p[0] for p in (tl, tr, br, bl)]), np.mean([p[1] for p in (tl, tr, br, bl)])
    quad = [(cx + (p[0] - cx) * 1.06, cy + (p[1] - cy) * 1.04) for p in (tl, tr, br, bl)]
    qw = np.hypot(quad[1][0] - quad[0][0], quad[1][1] - quad[0][1]); qh = np.hypot(quad[3][0] - quad[0][0], quad[3][1] - quad[0][1])
    sw = scr.width; sh = sw * qh / qw
    if sh > scr.height:
        sh = scr.height; sw = sh * qw / qh
    src = [(0, 0), (sw, 0), (sw, sh), (0, sh)]
    warped = scr.transform(f.size, Image.PERSPECTIVE, persp_coeffs(quad, src), Image.BICUBIC)
    mi = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    return Image.composite(warped, f, mi)

tmp = OUT + '_tmp'
os.makedirs(tmp, exist_ok=True)
for name, (fn, y0, y1) in CLIPS.items():
    for p in glob.glob(f'{tmp}/*.png'):
        os.remove(p)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', U + fn, f'{tmp}/%03d.png'], check=True)
    fr = sorted(glob.glob(f'{tmp}/*.png'))
    for i, p in enumerate(fr):
        f = Image.open(p).convert('RGB').crop((0, y0, 720, y1))
        f = f.resize((1080, round((y1 - y0) * 1.5)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
        if name in SCREEN:
            f = key(f, SCREEN[name])
        f.save(f'{OUT}{name}_{i:03d}.jpg', quality=90)
    fps = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', U + fn],
                         capture_output=True, text=True).stdout.strip()
    print(name, len(fr), 'cuadros', fps, f.size)
for p in glob.glob(f'{tmp}/*.png'):
    os.remove(p)
os.rmdir(tmp)
