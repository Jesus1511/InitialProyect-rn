import connectDB from './db.js';
import express from 'express'
import { configDotenv } from "dotenv";
import { createServer } from 'node:http';
import { setupSocket } from './chat/functions.js';
import cors from 'cors'

const app = express();
const server = createServer(app)
setupSocket(server);
app.use(cors());
const port = 3000

configDotenv()
connectDB()

import authRoutes from './auth/routes.js';
import chatRoutes from './chat/routes.js'

// Middleware para manejar JSON
app.use(express.json());

// rutas de usuarios
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes)

// Ruta principal
app.get('/index', (req, res) => {
  res.send('Servidor funcionando');
});

// Inicia el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
