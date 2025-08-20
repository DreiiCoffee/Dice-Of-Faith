@echo off
setlocal
pushd %~dp0
where py >nul 2>nul
if %errorlevel%==0 (
	py -3 main.py
) else (
	python main.py
)

popd
endlocal

