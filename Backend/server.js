import http from "http";
import app from './app.js'
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Project from './models/project.model.js';
import jwt from "jsonwebtoken";
import { generateResult } from "./services/ai.service.js";

dotenv.config();

const port = process.env.PORT || 3000;
const server = http.createServer(app) 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  }, 
});

io.use(async (socket, next) => {   
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;

        if(!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid Project ID'))
        }
        
        socket.project = await Project.findById(projectId);

        if(!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }
        socket.user = decoded;
        next(); 

    } catch (error) {
        next(error)
    }

})


io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    socket.join(socket.roomId);
    console.log('a user connected');

  socket.on('project-message',async (data) => {
    const message = data.message;
    const isAiPresentInMessage = message.includes('@ai');

    socket.broadcast.to(socket.roomId).emit('project-message', data);
    
    if(isAiPresentInMessage) {
        const prompt = message.replace('@ai', '');
        const result = await generateResult(prompt);
        io.to(socket.roomId).emit('project-message', { 
            message: result, 
            sender : {
                _id: 'ai',
                email: 'AI'
            } });
        return
    }
    
  });
  
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.leave(socket.roomId);
  });
});


server.listen(port, () => {
    console.log(`Server is Running on port : ${port}`)
})