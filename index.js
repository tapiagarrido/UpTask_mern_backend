import express from "express";
import dotenv from 'dotenv'
import cors from "cors"
import conectarDB from "./config/db.js";

//Rutas
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"

const app = express();
app.use(express.json());
dotenv.config();
conectarDB();

//configurar cors
const whitelist = [process.env.WHITE_LIST]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de Cors'))
        }
    }
}

app.use(cors(corsOptions))


// Routing
app.get('/', (req, res) => {
    res.send('Este es el Home')
})
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

const servidor = app.listen(process.env.PORT, (req, res, next) => {
    console.log(`servidor iniciado en el ${process.env.PORT}`)

})

// Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.WHITE_LIST,
  },
});

io.on("connection", (socket) => {
  // console.log("Conectado a socket.io");

  // Definir los eventos de socket io
  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea agregada", tarea);
  });

  socket.on("eliminar tarea", tarea =>{
    const proyecto = tarea.proyecto;

    socket.to(proyecto).emit("tarea eliminada", tarea)
  })

  socket.on("editar tarea", tarea =>{
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("tarea editada",tarea)
  })

  socket.on("cambiar estado", tarea =>{
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("nuevo estado", tarea)
  })
});