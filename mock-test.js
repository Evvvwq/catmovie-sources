
const https = require('https');
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {headers: {'User-Agent':'Mozilla/5.0'}}, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}
// mock utils_1
const utils_1 = {
  req: httpGet,
  kitty: { load: () => ({}) }
};
// mock env
const env = {
  baseUrl: 'https://91dongman.net',
  get: (k) => k === 'category' ? 'ai' : (k === 'page' ? '1' : undefined)
};
(async () => {
  try {
    const result = eval('(async function(){ ' + "const cate=env.get(\"category\");const page=env.get(\"page\");const p=Number(page||1);const url=p<=1?(env.baseUrl+\"/anime/ai/\"):(env.baseUrl+\"/anime/ai/page/\"+p+\"/\");const html=await(0,utils_1.req)(url);const out=[];const seen={};const re=/<a[^>]*href=\"(\\/anime\\/ai\\/(\\d+)\\/)\"[^>]*>([\\s\\S]*?)<\\/a>/g;let m;while((m=re.exec(html))&&out.length<50){const id=m[2];if(seen[id])continue;seen[id]=1;const inner=m[3];const cm=inner.match(/data-src=\"([^\"]*)\"/)||inner.match(/src=\"([^\"]*upload[^\"]*)\"/);const cover=cm?cm[1]:\"\";const am=inner.match(/alt=\"([^\"]*)\"/);let title=am?am[1]:\"\";if(!title)title=inner.replace(/<[^>]+>/g,\" \").trim();if(title&&title.length>1){out.push({id:\"/anime/ai/\"+id+\"/\",title,cover,remark:\"AI\u6f2b\u5267\"})}}return out" + ' })()');
    const out = await result;
    console.log('=== 执行成功 ===');
    console.log('返回类型:', Array.isArray(out) ? '数组' : typeof out);
    console.log('返回长度:', Array.isArray(out) ? out.length : JSON.stringify(out).slice(0,200));
    if (Array.isArray(out) && out.length > 0) {
      console.log('第一条:', JSON.stringify(out[0]));
    }
  } catch(e) {
    console.log('=== 执行报错 ===');
    console.log('错误:', e.message);
    console.log('堆栈:', e.stack.split('\n').slice(0,3).join('\n'));
  }
})();
