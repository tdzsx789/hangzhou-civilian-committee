const http = require('http');
const dgram = require('dgram');

const HTTP_PORT = process.env.PORT || 5050;
const UDP_PORT = 6000;
const isDev = true;
const currentIP = '192.168.22.12';
// const currentIP = '192.168.22.60';
// const currentIP = '192.168.22.51';

const getIp = (label) => {
  if (isDev) return ['127.0.0.1'];
  if (['ZJS', 'ZJSHZS', 'ZJSHZS1', 'SHS', 'SCSCDS', 'QUIT', 'LARGE', 'SMALL', 'ZTGS1', 'ZTGS2', 'ZTGS3', 'ZTGS4'].includes(label)) {
    return ['192.168.22.41', '192.168.22.42'];
  }
  if (label === 'P1-2' || label === 'P2-2') {
    return ['192.168.22.12'];
  }
  return [currentIP];
};

const sendUdp = (label) => new Promise((resolve, reject) => {
  const ips = getIp(String(label));
  console.log('targets', ips);
  const socket = dgram.createSocket('udp4');
  const payload = label === 'P1-2' ? 'P1' : (label === 'P2-2' ? 'P2' : String(label));
  const msg = Buffer.from(payload);
  
  let pending = ips.length;
  let errors = [];

  if (pending === 0) {
    socket.close();
    resolve();
    return;
  }

  ips.forEach(ip => {
    console.log('UDP_SEND', ip + ':' + UDP_PORT, payload);
    socket.send(msg, UDP_PORT, ip, (err) => {
      if (err) {
        console.error('UDP_ERROR', ip, err);
        errors.push(err);
      } else {
        console.log('UDP_SENT', ip, payload);
      }
      pending--;
      if (pending === 0) {
        socket.close();
        if (errors.length > 0) reject(errors[0]);
        else resolve();
      }
    });
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
