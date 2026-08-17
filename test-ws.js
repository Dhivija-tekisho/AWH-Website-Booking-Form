const WebSocket = require('ws');

const url = 'ws://localhost:3001/ws/chatbot/b071d1e0-0000-4000-8000-000000000001?threadId=test-thread-123';
const ws = new WebSocket(url);

ws.on('open', () => {
    console.log('Connected');
    ws.close();
});

ws.on('error', (err) => {
    console.error('WebSocket Error:', err.message);
});

ws.on('close', (code, reason) => {
    console.log(`WebSocket Closed: ${code} - ${reason}`);
});

ws.on('unexpected-response', (request, response) => {
    console.log(`Unexpected response: ${response.statusCode}`);
    response.on('data', chunk => console.log(chunk.toString()));
});
