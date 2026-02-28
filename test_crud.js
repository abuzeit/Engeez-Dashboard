const http = require('http');

async function test() {
  console.log('Starting CRUD verification...');
  
  const postData = JSON.stringify({
    name: 'Test Rule',
    type: 'Fixed',
    value: '10.00',
    region: 'Test Region',
    status: 'Active',
    lastUpdated: '2024-03-01'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/pricing',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const postRes = await new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(data); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  console.log('POST Success:', !!postRes.data && !!postRes.data.id);
  const newId = postRes.data.id;

  const patchData = JSON.stringify({ name: 'Updated Test Rule' });
  const patchOptions = {
    hostname: 'localhost',
    port: 3000,
    path: \`/api/pricing/\${newId}\`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': patchData.length
    }
  };

  const patchRes = await new Promise((resolve) => {
    const req = http.request(patchOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.write(patchData);
    req.end();
  });

  console.log('PATCH Success:', patchRes.name === 'Updated Test Rule');

  const deleteOptions = {
    hostname: 'localhost',
    port: 3000,
    path: \`/api/pricing/\${newId}\`,
    method: 'DELETE'
  };

  const deleteRes = await new Promise((resolve) => {
    const req = http.request(deleteOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.end();
  });

  console.log('DELETE Success:', deleteRes.id === newId);
  console.log('All tests passed!');
}

test().catch(console.error);
