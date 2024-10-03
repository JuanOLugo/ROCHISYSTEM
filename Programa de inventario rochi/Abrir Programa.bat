@echo off
set programa="C:\PRO\New Rochi"

:: Cambiar al directorio del servidor y ejecutar npm run dev en modo minimizado
start /min cmd /c "cd /d %programa%\server && npm run dev"

:: Cambiar al directorio del cliente y ejecutar npm run dev en modo minimizado
start /min cmd /c "cd /d %programa%\client && npm run dev"

:: Abrir el navegador en la URL especificada
start "" "http://localhost:5173"

pause