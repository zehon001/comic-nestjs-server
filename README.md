# comic-nestjs-server
基于Nestjs的漫画网站服务端+后台管理界面
nestjs+vue+mongodb+redis

#依赖
mongodb
redis

#搭建
git clone https://github.com/zehon001/comic-nestjs-server
cd server
yarn
yarn start -w admin
yarn start -w server
或者 
pm2 start ./dist/apps/server/main.js --name comic_server
pm2 start ./dist/apps/admin/main.js --name comic_admin

cd ../admin
yarn
yarn serve

cd ../comic
yarn
yarn serve



