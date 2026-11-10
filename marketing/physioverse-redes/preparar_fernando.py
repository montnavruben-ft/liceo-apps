"""Prepara los recursos del video de Fernando.
- Extrae los cuadros de los GIF de plastilina y los amplía a 1080 px de ancho.
- En el clip 3 sustituye la pantalla verde del celular por la captura del expediente.
- Normaliza las capturas de la app a 1188x2576 y quita el indicador de grabación.
Uso: python3 preparar_fernando.py <gif1> <gif2> <gif3> <expediente.jpg> <nuevo_exp.png> <importar.png>"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

gifs, exp, nuevo, imp = sys.argv[1:4], sys.argv[4], sys.argv[5], sys.argv[6]
OUT = 'assets/fernando/'

def frames(path):
    im = Image.open(path); out = []
    try:
        while True:
            out.append(im.convert('RGB').copy()); im.seek(im.tell() + 1)
    except EOFError:
        pass
    return out

def up(im):
    w = 1080; h = round(im.height * w / im.width)
    return im.resize((w, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))

# Capturas de la app
def norm(path, dot=False):
    im = Image.open(path).convert('RGB').resize((1188, 2576), Image.LANCZOS)
    if dot:
        ImageDraw.Draw(im).ellipse((372, 57, 420, 105), fill=(0, 0, 0))
    return im
exp_im = norm(exp, dot=True)
exp_im.save(OUT + 'expediente.jpg', quality=93)
norm(nuevo).save(OUT + 'nuevo.jpg', quality=93)
norm(imp).save(OUT + 'importar.jpg', quality=93)

# Pantalla para el celular de Fernando: el expediente sin barra de estado
screen = exp_im.crop((0, 120, 1188, 2576))

for k, g in enumerate(gifs):
    for i, f in enumerate(frames(g)):
        f = up(f)
        if k == 2:  # chroma key
            a = np.asarray(f).astype(int)
            r, gg, b = a[..., 0], a[..., 1], a[..., 2]
            m = (gg > 120) & (gg - r > 50) & (gg - b > 50)
            mi = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1))
            ys, xs = np.where(m)
            x0, x1, y0, y1 = xs.min() - 2, xs.max() + 3, ys.min() - 2, ys.max() + 3
            bw, bh = x1 - x0, y1 - y0
            s = max(bw / screen.width, bh / screen.height)
            sc = screen.resize((round(screen.width * s), round(screen.height * s)), Image.LANCZOS)
            cx = (sc.width - bw) // 2
            sc = sc.crop((cx, 0, cx + bw, bh))
            layer = Image.new('RGB', f.size); layer.paste(sc, (x0, y0))
            f = Image.composite(layer, f, mi)
        f.save(f'{OUT}c{k + 1}_{i}.jpg', quality=92)
    print('clip', k + 1, 'ok', f.size)
