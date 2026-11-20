param([string]$Ffmpeg = 'ffmpeg')

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$videoDirectory = Join-Path $root 'public/videos'
$outputDirectory = Join-Path $videoDirectory 'previews'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

# Cada video numerado (video1.mp4, video2.mp4...) genera su vista previa.
$sources = Get-ChildItem -LiteralPath $videoDirectory -File |
  Where-Object { $_.Name -match '^video\d+\.mp4$' } |
  Sort-Object { [int]($_.BaseName -replace '\D', '') }
if (-not $sources) { throw "No hay videos numerados en $videoDirectory" }

foreach ($source in $sources) {
  $number = $source.BaseName -replace '^video', ''
  $preview = Join-Path $outputDirectory "video$number.mp4"
  $poster = Join-Path $outputDirectory "video$number.webp"

  & $Ffmpeg -hide_banner -loglevel error -y -ss 2 -i $source.FullName -t 10 -an -vf 'scale=360:-2,fps=24' -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -movflags +faststart $preview
  if ($LASTEXITCODE -ne 0) { throw "No se pudo generar la vista previa de video$number" }
  & $Ffmpeg -hide_banner -loglevel error -y -ss 2 -i $source.FullName -frames:v 1 -vf 'scale=480:-2' -c:v libwebp -quality 82 $poster
  if ($LASTEXITCODE -ne 0) { throw "No se pudo generar la portada de video$number" }

  Get-Item -LiteralPath $preview | Select-Object Name, Length
}
