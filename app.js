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

// Handle incoming socket connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("Chat Server listening on port " + PORT);
});
