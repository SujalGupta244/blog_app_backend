import express, { Router } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user-routes'
import blogRouter from './routes/blog-routes';
import cookieParser from 'cookie-parser';
import env from 'dotenv';
import cors from 'cors';

// 

const app = express();
var PORT = 5000;

env.config()
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/', ((req,res) =>{
    res.render('Blog App Backend Server');
}))

app.use('/api/user',userRouter)
app.use('/api/blog',blogRouter)


mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.k8a6eub.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>
app.listen(PORT,()=>{
    console.log("Connected to database")
}));

// .then(()=>console.log("Hello world"))




