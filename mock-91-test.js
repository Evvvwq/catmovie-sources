// 模拟小猫影视 JS 源执行环境
// 用 node 直接执行 91 源的 home 函数体

const https = require('https');
const http = require('http');

// ---- 模拟全局 req (kitty 的 req 是封装好的fetch-like) ----
async function req(url) {
  const u = new URL(url);
  const mod = u.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const options = {
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      // 关键: 完全不用代理
    };
    const r = mod.request(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve(data));
    });
    r.on('error', reject);
    r.end();
  });
}

// ---- 模拟 env ----
const env = {
  get: (key, def) => {
    const map = { category: '', page: '1', baseUrl: 'https://91dongman.net' };
    return map[key] !== undefined ? map[key] : def;
  },
  baseUrl: 'https://91dongman.net',
};

// ---- 加载91源文件 ----
const fs = require('fs');
const src = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))[0];
const js = src.extra.js;

(async () => {
  console.log('源:', src.name, '| api:', src.api);
  // home 是 async 函数体, 用 (async function(){...})() 包装
  const homeFn = new Function('req', 'env', 'kitty', `return (async function(){ ${js.home} })()`);
  try {
    const result = await homeFn(req, env, { load: () => { throw new Error('kitty.load未用到(纯正则)'); } });
    console.log('home返回类型:', typeof result, Array.isArray(result) ? '数组' : (result && result.type));
    if (Array.isArray(result)) {
      console.log('条数:', result.length);
      console.log('第一条:', JSON.stringify(result[0]).slice(0, 200));
    } else if (result && result.type === 'complex') {
      console.log('complex, 区块数:', result.data.length);
      console.log('区块1标题:', result.data[0].title, '| videos数:', result.data[0].videos.length);
      console.log('第一条:', JSON.stringify(result.data[0].videos[0]).slice(0, 200));
    }
  } catch (e) {
    console.error('home执行失败:', e.message);
  }
})();
