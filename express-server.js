require('./server/cronJob');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 8080;
const binanceApiUrl = 'https://testnet.binancefuture.com';

app.use(cors()); // Add this line to enable CORS for all routes

app.use('/binance', createProxyMiddleware({
  target: binanceApiUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/binance': ''
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
  },
}));

app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});


