import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'PROGRESS' | 'DONE';
    createdAt: Date;
}

const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();
app.use(express.json());


const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('websocket connected');
    ws.send(JSON.stringify({ event: 'WELCOME', message: 'connected' }));
});

const tickets: Ticket[] = [];
app.get('/tickets', (req, res) => {
    res.json(tickets);
});




server.listen(PORT, () => {
    console.log(`server http://localhost:${PORT}`);
    console.log(`websocket ws://localhost:${PORT}`);
});