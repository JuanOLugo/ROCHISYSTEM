@echo off
set /p programa="Introduce la ruta del programa: "

:: Cambiar al directorio del servidor y ejecutar npm install
start cmd /k "cd /d "%programa%\server" && npm install"

:: Cambiar al directorio del cliente y ejecutar npm install
start cmd /k "cd /d "%programa%\client" && npm install "

echo Instalación completada.
pause
