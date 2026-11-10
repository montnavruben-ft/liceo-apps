"""Prepara las capturas para las animaciones: quita el indicador de grabación
y enmascara el teléfono del paciente. Uso: python3 preparar_assets.py <splash> <inicio> <sesion>"""
import sys
from PIL import Image, ImageDraw
splash, inicio, sesion = (Image.open(p).convert('RGB') for p in sys.argv[1:4])
for im in (splash, inicio, sesion):
    ImageDraw.Draw(im).ellipse((372, 57, 420, 105), fill=(0, 0, 0))  # punto rojo de grabación
d = ImageDraw.Draw(sesion)
d.rectangle((244, 882, 480, 926), fill=(249, 250, 252))  # teléfono -> se redibuja en HTML
# logo recortado del splash
splash.crop((461, 995, 724, 1256)).save('assets/logo.png')
inicio.save('assets/inicio.jpg', quality=93)
sesion.save('assets/sesion.jpg', quality=93)
# modal aislado (sesión) para animarlo por separado
sesion.crop((45, 345, 1142, 2297)).save('assets/modal.png')
sesion.crop((0, 0, 1188, 150)).save('assets/status_sesion.png')
