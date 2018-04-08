@echo off
title StartRedis
cd\
D:
cd "Program Files/redis-2.4.2/64bit/"
start redis-server.exe
npm run dev
@cmd.exe
pause

