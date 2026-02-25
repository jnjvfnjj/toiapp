@echo off
echo Building React frontend...
cd templates
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Building application...
call npm run build
echo Build complete!
cd ..
pause
