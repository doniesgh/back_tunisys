const { Server } = require('socket.io');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Add your client's URL here
      methods: ["GET", "POST"]
    }
  });

  let onlineUsers = [];

  const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId });
  };

  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };

  const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
  };

  io.on("connection", (socket) => {
    socket.on('NEW USER ', (username) => {
      addNewUser(username, socket.id);
    });

    socket.on("sendNotification", ({ senderName, receiverName, type }) => {
      const receiver = getUser(receiverName);
      io.to(receiver.socketId).emit("getNotification", {
        senderName,
        type,
      });
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("Disconnect");
    });
  });

  return io;
};

module.exports = initSocket;
