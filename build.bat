@echo off
echo Building BoxHead Zombie Survival Game...
echo.

@REM echo Installing dependencies...
@REM npm install

echo.
echo Building executable...
npm run dist

echo.
echo Build complete! Check the 'dist' folder for the executable.
pause