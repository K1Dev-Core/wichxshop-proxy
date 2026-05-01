const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { path: apiPath } = req.query;
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiPath) {
      res.status(400).json({ success: false, message: 'Missing path parameter' });
      return;
    }

    if (!apiKey) {
      res.status(400).json({ success: false, message: 'Missing x-api-key header' });
      return;
    }

    const baseUrl = 'https://wichxshop.com/api/v1';
    const url = `${baseUrl}${apiPath}`;

    const method = req.method || 'GET';
    const body = method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined;

    const headers = {
      'x-api-key': apiKey,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://wichxshop.com/',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method,
      headers,
      body,
      timeout: 15000
    });

    const data = await response.text();

    try {
      const json = JSON.parse(data);
      res.status(response.status).json(json);
    } catch {
      res.status(response.status).send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ success: false, message: error.message || 'Proxy error' });
  }
};
