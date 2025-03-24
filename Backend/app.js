import express from "express"
import morgan from "morgan"
import connect from "./db/db.js"
import userRoutes from "./routes/user.routes.js"
import projectRoute from "./routes/project.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import cookieParser from "cookie-parser"
import cors from 'cors'

connect();
const app = express()  

app.use(cors())
app.use(morgan('dev'))  // to know server request in the terminal
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/users',userRoutes)
app.use('/project',projectRoute)
app.use('/ai',aiRoutes)
app.use(cookieParser())

app.get('/', (req,res) => {
    res.send("Hello World!")
})

export default app