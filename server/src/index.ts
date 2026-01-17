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
const API_KEY = "dmytro";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('websocket connected');
    ws.send(JSON.stringify({ event: 'WELCOME', message: 'connected' }));
});

const broadcast = (event: string, data: any) => {
    const message = JSON.stringify({ event, data });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// middle ware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) return res.status(403).json({ error:'invalid admin key'});
    next();
};

const tickets: Ticket[] = [];
app.get('/tickets', (req, res) => {
    res.json(tickets);
});


app.post('/tickets', requireAuth, (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTicket: Ticket = {
        id: Date.now().toString(),
        title,
        description: description || '',
        status: 'OPEN',
        createdAt: new Date()
    };

    tickets.push(newTicket);
    
    console.log(`[REST] created ticket: ${newTicket.id}`);
    broadcast('TICKET_CREATED', newTicket);

    res.status(201).json(newTicket);
});


app.patch('/tickets/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`[DEBUG] Get request PATCH for ID: "${id}"`);
    console.log(`[DEBUG] Type received ID: ${typeof id}`);
    console.log(`[DEBUG] Avalible ID in db:`, tickets.map(t => t.id));

    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
        console.log(`[ERROR] Ticket not found!`);
        return res.status(404).json({ error: 'Ticket not found' });
    }
    if (status) ticket.status = status;

    console.log(`[REST] Updated ticket: ${id} to ${status}`);
    broadcast('TICKET_UPDATED', ticket);

    res.json(ticket);
});


server.listen(PORT, () => {
    console.log(`server http://localhost:${PORT}`);
    console.log(`websocket ws://localhost:${PORT}`);
});