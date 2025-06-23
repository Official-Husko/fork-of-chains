@echo off
:: Fort of Chains Basic Compiler - Windows. Adapted from free cities.

:: By default compiles with the script/styles bundles from /generated/dist
:: Run with 'debug' arg to use the ones from /generated/debug

:: Set working directory
pushd %~dp0

:: Run the appropriate compiler for the user's CPU architecture.
IF %PROCESSOR_ARCHITECTURE% == AMD64 (
  SET "TWEEGO_EXE=%~dp0dev\tweeGo\tweego_win64.exe"
) ELSE (
  SET "TWEEGO_EXE=%~dp0dev\tweeGo\tweego_win86.exe"
)

SET "OUTFILE=%~3"
IF "%OUTFILE%"=="" (
  SET "OUTFILE=%~dp0dist/index.html"
)

SET "GENERATED_DIR=%~1"
IF "%~1"=="" (
	SET "GENERATED_DIR=generated/dist"
)
IF "%~1"=="dist" (
	SET "GENERATED_DIR=generated/dist"
)
IF "%~1"=="debug" (
  SET "GENERATED_DIR=generated/debug"
)

SET "SCRIPTS_DIR="
SET "STYLES_DIR="
IF NOT "%~1"=="devserver" (
  SET "SCRIPTS_DIR=%~dp0%GENERATED_DIR%/scripts/"
  SET "STYLES_DIR=%~dp0%GENERATED_DIR%/styles/"
)

ECHO "Running tweego"

@echo on
CALL "%TWEEGO_EXE%" -f "sugarcube-2" %~2 -m "%~dp0src/modules/" --head "src/head-content.html" -o "%OUTFILE%" "%~dp0project/" %SCRIPTS_DIR% %STYLES_DIR%
@echo off

IF NOT "%~1"=="devserver" (
  SET "DYNAMIC_MODULES_DIR=dist/js"
  IF "%GENERATED_DIR%"=="debug" (
    SET "DYNAMIC_MODULES_DIR=dist/js-debug"
  )
  xcopy "%~dp0%GENERATED_DIR%/dynamic-modules" "%DYNAMIC_MODULES_DIR%" /s /t
)

popd
ECHO "Built %OUTFILE%"
