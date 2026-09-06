const express=require('express');
const app=express();
require('dotenv').config();
const main=require('./config/db');
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/userAuth');
const noteRouter=require('./routes/noteWork')
const redisClient = require("./config/redis");
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/notes',noteRouter);




const InitializeConnection=async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB connected");
        app.listen(process.env.PORT,()=>{
        console.log("Server is listening at port number "+process.env.PORT);
    })
    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitializeConnection();