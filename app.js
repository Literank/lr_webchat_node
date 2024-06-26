import { createServer } from "http";
import { Server } from "socket.io";

// Create a basic HTTP server
const server = createServer();
// Attach Socket.IO to the HTTP server with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*", // Allow accesses from any origin
  },
});

// Use a Map to store all connected users
const users = new Map();

// Handle incoming socket connections
io.on("connection", (socket) => {
  socket.on("user-join", (user) => {
    if (!user.name) {
      return;
    }
    console.log(`User ${socket.id} => ${user.emoji} ${user.name} joined`);
    users.set(socket.id, { ...user, sid: socket.id });

    // Broadcast to all connected clients
    io.emit("contacts", Array.from(users.entries()));
  });

  socket.on("chat", (data) => {
    const { to } = data;
    io.to(to).emit("chat", data);
  });

  socket.on("group-chat", (data) => {
    const { room } = data;
    io.to(room).except(socket.id).emit("group-chat", data);
  });

  // Create Room
  socket.on("create-group", (data) => {
    const { sids: socketIds, name: roomName, id: roomId } = data;
    socketIds.forEach((socketId) => {
      io.sockets.sockets.get(socketId)?.join(roomId);
    });
    io.to(roomId).emit("create-group", data);
    console.log(`Room ${roomId} => ${roomName} created`);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("Chat Server listening on port " + PORT);
});
