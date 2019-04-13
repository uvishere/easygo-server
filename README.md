# easygo-server [![Build Status](https://travis-ci.org/uvishere/easygo-server.svg?branch=master)](https://travis-ci.org/uvishere/easygo-server)


#Getting Started
1. git clone this Repo
2. `npm install`
3. create rename .env.example to .env and change the environment variable's values.

#Server Deployment using pm2 
either run
`npm run server` or
go to the project root folder and run, `pm2 start src/index.js --name='processname'`. This is to fix the environment variable loading issue when pm2 is started from inside the folder (means pm2 cwd is set to index/inside-folder-path)
