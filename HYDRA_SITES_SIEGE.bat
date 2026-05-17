@echo off
title 🏴‍☠️ HYDRA GOOGLE SITES SIEGE ENGINE
echo ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
echo 🧛‍♂️ DRKCNAY ELITE: HYDRA GOOGLE SITES KUŞATMA BAŞLATILIYOR
echo ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
echo.

set /p ROUND="Hangi turu baslatmak istersiniz? (1, 2 veya 3): "
set /p LIMIT="Kac ilce kusatilsin? (Default: 39): "

if "%LIMIT%"=="" set LIMIT=39

echo 🚀 Kusatma baslatiliyor: Tur %ROUND% | Limit %LIMIT% ilce...
echo.

npx tsx scripts/hydra-sites-siege-engine.ts %ROUND% istanbul %LIMIT%

echo.
echo ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
echo ✅ KUŞATMA TAMAMLANDI.
pause
