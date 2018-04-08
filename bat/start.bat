@echo off
cd "d:/git/hospital/bat"
start start_hospital.bat
cd\
D:
cd "Program Files/redis-2.4.2/64bit/"
start redis-server.exe
cd\
D:
cd "Program Files/MongoDB/Server/3.6/bin"
mongod --config mongodb.conf
@cmd.exe

