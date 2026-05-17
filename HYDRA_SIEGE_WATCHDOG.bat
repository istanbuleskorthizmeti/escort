@echo off
title 🛡️ HYDRA SIEGE WATCHDOG v1.0
setlocal enabledelayedexpansion

:LOOP
cls
echo ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
echo 🧛‍♂️ HYDRA SIEGE WATCHDOG: KUŞATMA DEVAM EDİYOR...
echo 🕒 Zaman: %TIME%
echo ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
echo.

:: Run the siege engine for ONE district
:: The script is now state-aware and will pick the next pending district.
npx tsx scripts/hydra-sites-siege-engine.ts

:: Check exit code
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ [ERROR] Script failed or crashed. 
    echo ⏳ 30 saniye içinde yeniden denenecek...
    timeout /t 30
) else (
    echo.
    echo ✅ [SUCCESS] Bir ilçe başarıyla tamamlandı.
    echo ⏳ 15 saniye soğuma süresi...
    timeout /t 15
)

goto LOOP
