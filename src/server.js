const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Almacenamiento en memoria de salas y usuarios
const rooms = new Map();
const users = new Map();

// Ruta por defecto - Status
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint de estado simple
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

// Generar código único para sala
app.post('/api/create-room', (req, res) => {
  const roomCode = nanoid(6).toUpperCase();
  rooms.set(roomCode, {
    code: roomCode,
    users: [],
    messages: [],
    createdAt: new Date()
  });
  res.json({ roomCode });
});

// Verificar si sala existe
app.get('/api/room/:code', (req, res) => {
  const room = rooms.get(req.params.code);
  if (room) {
    res.json({ exists: true, userCount: room.users.length });
  } else {
    res.json({ exists: false });
  }
});

// Socket.io para comunicación en tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a una sala
  socket.on('join-room', ({ roomCode, userName, userColor }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    // Crear usuario
    const user = {
      id: socket.id,
      name: userName,
      color: userColor,
      location: null,
      lastUpdate: new Date()
    };

    users.set(socket.id, { ...user, roomCode });
    room.users.push(user);

    socket.join(roomCode);

    // Notificar a todos en la sala
    io.to(roomCode).emit('user-joined', {
      user: user,
      users: room.users
    });

    // Enviar mensajes anteriores al nuevo usuario
    socket.emit('previous-messages', room.messages);

    console.log(`${userName} se unió a la sala ${roomCode}`);
  });

  // Actualizar ubicación
  socket.on('update-location', ({ latitude, longitude }) => {
    const userData = users.get(socket.id);

    if (!userData) return;

    const { roomCode } = userData;
    const room = rooms.get(roomCode);

    if (!room) return;

    // Actualizar ubicación del usuario
    const userIndex = room.users.findIndex(u => u.id === socket.id);
    if (userIndex !== -1) {
      room.users[userIndex].location = { latitude, longitude };
      room.users[userIndex].lastUpdate = new Date();
    }

    // Emitir a todos en la sala
    io.to(roomCode).emit('location-update', {
      userId: socket.id,
      location: { latitude, longitude },
      timestamp: new Date()
    });
  });

  // Enviar mensaje al grupo
  socket.on('send-message', ({ message }) => {
    const userData = users.get(socket.id);

    if (!userData) return;

    const { roomCode } = userData;
    const room = rooms.get(roomCode);

    if (!room) return;

    const messageData = {
      id: nanoid(),
      userId: socket.id,
      userName: userData.name,
      userColor: userData.color,
      message: message,
      type: 'group',
      timestamp: new Date()
    };

    room.messages.push(messageData);

    // Limitar a últimos 100 mensajes
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }

    io.to(roomCode).emit('new-message', messageData);
  });

  // Enviar mensaje privado (1 a 1)
  socket.on('send-private-message', ({ toUserId, message }) => {
    const userData = users.get(socket.id);
    const toUserData = users.get(toUserId);

    if (!userData || !toUserData) return;

    const messageData = {
      id: nanoid(),
      fromUserId: socket.id,
      fromUserName: userData.name,
      fromUserColor: userData.color,
      toUserId: toUserId,
      toUserName: toUserData.name,
      message: message,
      type: 'private',
      timestamp: new Date()
    };

    // Enviar al destinatario
    io.to(toUserId).emit('new-private-message', messageData);

    // Enviar confirmación al remitente
    socket.emit('new-private-message', messageData);

    console.log(`Mensaje privado de ${userData.name} a ${toUserData.name}`);
  });

  // Usuario escribiendo
  socket.on('typing', ({ isTyping }) => {
    const userData = users.get(socket.id);
    if (!userData) return;

    const { roomCode } = userData;
    socket.to(roomCode).emit('user-typing', {
      userId: socket.id,
      userName: userData.name,
      isTyping
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);

    if (userData) {
      const { roomCode } = userData;
      const room = rooms.get(roomCode);

      if (room) {
        room.users = room.users.filter(u => u.id !== socket.id);

        io.to(roomCode).emit('user-left', {
          userId: socket.id,
          userName: userData.name,
          users: room.users
        });

        // Eliminar sala si está vacía por más de 1 hora
        if (room.users.length === 0) {
          setTimeout(() => {
            const currentRoom = rooms.get(roomCode);
            if (currentRoom && currentRoom.users.length === 0) {
              rooms.delete(roomCode);
              console.log(`Sala ${roomCode} eliminada por inactividad`);
            }
          }, 3600000); // 1 hora
        }
      }

      users.delete(socket.id);
    }

    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
