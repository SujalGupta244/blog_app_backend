import express, { Router } from 'express';
import mongoose from 'mongoose';
import root from './routes/root'
import userRouter from './routes/user-routes'
import blogRouter from './routes/blog-routes';
import cookieParser from 'cookie-parser';
import env from 'dotenv';
import cors from 'cors';
import path from 'path'

const app = express();
var PORT = 5000;

env.config()
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Allow serve static files if in production
app.use(express.static(path.join("views")))
// Route use to show html page directly by backend
app.use("/", root)


app.use('/api/user',userRouter)
app.use('/api/blog',blogRouter)


mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.k8a6eub.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>
app.listen(PORT,()=>{
    console.log("Connected to database")
}));

// .then(()=>console.log("Hello world"))




