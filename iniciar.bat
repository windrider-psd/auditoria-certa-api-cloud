@setlocal enableextensions
@cd /d "%~dp0"

call npm i typescript
call npm i

call npm run build 

node dist\index.js

@echo off
cmd /k