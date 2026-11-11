#!/usr/bin/env bash
# Une las escenas renderizadas (build/) en los videos finales para redes (videos/).
set -euo pipefail
cd "$(dirname "$0")"
une() { out=$1; shift; args=(); f=""; i=0
  for s in "$@"; do args+=(-i "build/$s.mp4"); f+="[$i:v]"; i=$((i+1)); done
  ffmpeg -y -loglevel error "${args[@]}" -filter_complex "${f}concat=n=$#:v=1:a=0[v]" -map "[v]" \
    -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart "videos/$out"; echo "videos/$out"; }
une 00_promo_completo.mp4  intro agenda sesion outro
une 01_intro_teaser.mp4    intro
une 02_agenda_busqueda.mp4 agenda outro
une 03_sesion_clinica.mp4  sesion outro
une 04_logo_galaxia.mp4     galaxia
une 05_fernando_migracion.mp4 fernando
une 06_valoracion_completa.mp4 valoracion
une 07_informe_progreso.mp4 informe
