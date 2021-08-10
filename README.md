
📢  一个网络代理客户端, 依赖于 Anyproxy. 构建在 Electron 和 Vue 之上. 

## 功能
1. 网络抓包：提供类似Chrome的预览功能，支持http/https。
2. 埋点查看: 格式化埋点请求数据，查看埋点信息。
3. 数据拦截：支持修改请求头，请求数据，返回头，返回数据等。
4. 网速限制：模拟各种网段的网速。
5. 接口Mock: 根据具体项目管理模拟mock接口

## 本地运行
启动UI界面
```
cd client
yarn
yarn serve
```
启动electron应用
```javascript
yarn
yarn start
```
## 打包软件
```javascript
yarn build
```
安装包会生成到dist目录下

## LISCENCE
MIT
