
const https=require('https');
function httpGet(url){return new Promise((res,rej)=>{https.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(d))}).on('error',rej)})}
// cheerio 需要真实加载 - 简化mock: 用手写解析代替
const utils_1={req:httpGet};
const env={baseUrl:'https://www.yobooki.com',get:k=>k==='category'?'47':(k==='page'?'1':undefined)};
(async()=>{try{
  // 不依赖kitty.load, 用正则粗测URL是否可达
  const html=await utils_1.req('https://www.yobooki.com/tv/47.html');
  console.log('列表页大小:',html.length);
  console.log('含video链接:', (html.match(/\/video\/\d+\.html/g)||[]).length);
  console.log('含标题示例:', (html.match(/title="([^"]{4,20})"/g)||[]).slice(0,3));
}catch(e){console.log('ERR:',e.message)}})();
