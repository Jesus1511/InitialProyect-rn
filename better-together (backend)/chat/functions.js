import jwt from 'jsonwebtoken'
import { User } from '../auth/model.js';
import { Chats } from './models.js';
import { Server } from 'socket.io';

export function authenticateSocketToken(socket, next) {
    const token = socket.handshake?.query?.token;  // Obtener el token de la consulta

    if (!token) {
        return next(new Error('Token requerido'));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
        if (err) {
            return next(new Error('Token inválido'));
        }
        try {
            const user = await User.findById(decodedUser.id);  // Buscar al usuario usando el `id` del token
            if (!user) {
                return next(new Error('Usuario no encontrado'));
            }
            socket.user = user;  // Adjuntar el usuario al socket
            socket.token = token;  // Almacenar el token en el socket (por si necesitas acceder al token directamente)
            next();  // Continuar con la conexión
        } catch (error) {
            return next(new Error('Error al buscar el usuario en la base de datos'));
        }
    });
}

export function setupSocket(server) {
    const io = new Server(server, {
        cors: "*"
    });

    io.on('connection', (socket) => {
        console.log('A user is connected');

        // Listen for openChat event
        socket.on('openChat', (chat) => {
            const chatRoom = chat._id; // assuming chat contains the room ID

            // Join the specified room
            socket.join(chatRoom);
            console.log(`User joined chat room: ${chatRoom}`);

            

            // Listen for sending a message
            socket.on('sendMessage', (messageData) => {
                const { content, user } = messageData;
                const message = { content, user };
                io.to(chatRoom).emit('newMessage', message);
                console.log(`Message sent to room ${chatRoom}:`, message);
            });
            

            // Listen for closing the chat
            socket.on('closeChat', () => {
                socket.removeAllListeners('sendMessage');
                socket.leave(chatRoom);
                console.log(`User left chat room: ${chatRoom}`);
            });
            
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
}

export async function createChat(req, res) {
    try {
        const { id } = req.body;
        const user = req.user;

        if (!id) {
            res.status(400).json({ message: "ID del usuario es requerido" });
            return 
        }

        if (user._id.toString() === id) {
            res.status(400).json({ message: "No puedes crear un chat contigo mismo" });
            return 
        }

        const otherUser = await User.findById(id);
        if (!otherUser) {
            res.status(404).json({ message: "El usuario no existe" });
            return 
        }

        const existingChat = await Chats.findOne({ 
            "users._id": { $all: [user._id, id] } 
        });


        if (existingChat) {
            res.status(200).json({ message: "El chat ya existe", chat: existingChat });
            return 
        }

        // Crear un nuevo chat
        const newChat = new Chats({ users: [{_id:user._id, name:user.name}, {_id:id, name:otherUser.name}], notReadedMessages: [] });
        await newChat.save();

        res.status(201).json({ message: "Chat creado exitosamente", chat: newChat });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al crear el chat" });
    }
}

export async function getYourChats(req, res) {
    try {
        const user = req.user;

        const chats = await Chats.find({"users._id": { $all: user._id }}).lean();

        if (chats.length === 0) {
            res.status(200).json({ message: "No tienes ningún chat", chats: [] });
            return 
        }

        res.status(200).json({ message: "Chats obtenidos exitosamente", chats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los chats' });
    }
}
