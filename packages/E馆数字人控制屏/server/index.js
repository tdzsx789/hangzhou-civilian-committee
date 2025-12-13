const http = require('http');
const dgram = require('dgram');

const HTTP_PORT = process.env.PORT || 5050;
const UDP_PORT = 6000;
const isDev = false;

const getIp = (label) => (isDev ? '127.0.0.1' : (label === 'P1-2' || label === 'P2-2' ? '192.168.22.12' : '192.168.22.28'));

const sendUdp = (label) => new Promise((resolve, reject) => {
  const ip = getIp(String(label));
  console.log('ip', ip)
  const socket = dgram.createSocket('udp4');
  const payload = label === 'P1-2' ? 'P1' : (label === 'P2-2' ? 'P2' : String(label));
  const msg = Buffer.from(payload);
  console.log('UDP_SEND', ip + ':' + UDP_PORT, payload);
  socket.send(msg, UDP_PORT, ip, (err) => {
    socket.close();
    if (err) {
      console.error('UDP_ERROR', err);
      reject(err);
    } else {
      console.log('UDP_SENT', payload);
      resolve();
    }
  });
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const writeJson = (res, status, obj) => {
  res.writeHead(status, { 'Content-Type': 'application/json', ...corsHeaders });
  res.end(JSON.stringify(obj));
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }
  if (req.method === 'GET' && req.url === '/health') {
    writeJson(res, 200, { ok: true });
    return;
  }
  if (req.method === 'POST' && req.url === '/send') {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', async () => {
      try {
        const label = String(data || '').trim();
        console.log('HTTP_SEND', label);
        if (!label) {
          writeJson(res, 400, { ok: false, error: 'label required' });
          return;
        }
        await sendUdp(label);
        writeJson(res, 200, { ok: true });
      } catch (e) {
        writeJson(res, 500, { ok: false, error: String(e && e.message ? e.message : e) });
      }
    });
    return;
  }
  writeJson(res, 404, { ok: false });
});

server.listen(HTTP_PORT, () => {
  console.log('HTTP_LISTEN', HTTP_PORT, 'DEV', isDev);
});
