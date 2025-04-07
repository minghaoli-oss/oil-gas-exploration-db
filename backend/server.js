const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();

// 替换为你的高德地图API Key和安全密钥
const AMAP_KEY = '57c6d8007e685b0eae6374adab97fb29'; // 从高德开放平台获取
const AMAP_SECRET = 'ae3eed6c644db1b7360c054951ce8361'; // 从高德开放平台获取

// 允许跨域请求（因为前端运行在不同端口）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 代理地理编码请求
app.get('/amap/geocode', async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: '缺少 address 参数' });
  }

  // 构造请求参数
  const params = {
    address: address,
    key: AMAP_KEY,
    output: 'JSON'
  };

  // 生成签名（sig）- 根据高德地图API的要求
  const paramStr = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&') + AMAP_SECRET;
  const sig = crypto.createHash('md5').update(paramStr).digest('hex');
  const url = `https://restapi.amap.com/v3/geocode/geo?${Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')}&sig=${sig}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('地理编码请求失败：', error.message);
    res.status(500).json({ error: '地理编码请求失败' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
});