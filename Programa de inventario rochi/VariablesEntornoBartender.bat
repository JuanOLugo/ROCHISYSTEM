@echo off
set /p MY_CUSTOM_PATH="Introduce la ruta donde tengas descargado Bartender: "
setx Bartender_Rochi "%MY_CUSTOM_PATH%"
echo Ruta añadida a las variables de entorno: %MY_CUSTOM_PATH%
pause