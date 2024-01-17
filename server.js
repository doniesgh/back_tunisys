require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const traiteurRoutes = require('./routes/traiteur')
const recRoutes = require('./routes/reclamation')
const equiRoutes = require('./routes/equipement')
const notiRoutes = require('./routes/notification')
const interRoutes = require('./routes/intervention')
const clientRoutes = require('./routes/client')
const contractRoutes = require('./routes/contrat')
const serviceRoutes = require('./routes/service')

const ws = require('ws')
const { Server } = require('socket.io');

const cors = require('cors')
const app = express()
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/user', userRoutes)
app.use('/api/inter', interRoutes)
app.use('/api/rec', recRoutes)
app.use('/api/equi', equiRoutes)
app.use('/api/trait', traiteurRoutes)
app.use('/api/notification',notiRoutes )
app.use('/api/client',clientRoutes)
app.use('/api/contrat',contractRoutes)
app.use('/api/service',serviceRoutes)


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
   
  })
  .catch((err) => {
    console.log(err)
  }) 
  const server = app.listen(process.env.PORT, () => {
    console.log('listening for requests on port', process.env.PORT)
  })


const io = new Server({ 
  cors:{
    origin:"http://localhost:3000"
  }
});
io.on("connection", (socket) => {
  socket.on('NEW USER', (username) => {
    addNewUser(username, socket.id);
  });

  console.log("someone has connected !");

  socket.on('setup', (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      console.log(userData._id);
      socket.emit('connected');
      console.log(userData)
    } else {
      console.error('userData:', userData);
    }
  });
  socket.on('sendNotification', ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName); 
    if (receiver) {
      io.to(receiver.socketId).emit('getNotification', {
        senderName,
        type,
      });
    }
  });
  

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});

io.listen(5000);