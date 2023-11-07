import express from  "express";
import dotenv from 'dotenv';// load the environment variables defined in your .env file into process.env.
import mongoose from 'mongoose';
import router from './Routes/booksRoute.js';
import authRoute from './Routes/AuthRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
dotenv.config(); 
// middleware for parsing request body
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRETE_KEY,  // a secret string used to sign the session ID cookie
    resave: false,  // it forces the session to be saved to the session store on every request, even if the session data hasn't changed. 
    saveUninitialized: true  // don't create session until something stored
  }))


//middleware to handle cors policy
//allow all origins with default of cors(*)
app.use(cors())


//allow Custom Origins
// app.use(cors({
//     origin:'http://localhost:3000',
//     methods:['GET','POST','PUT','DELETE'],
//     allowedHeaders:['Content-Type']
// }))

app.get('/',(req,res)=>{
    console.log(req);
    res.status(200).send('Hello World')
})

app.use('/Books',router);

app.use('/auth',authRoute);


// to connect database

mongoose.connect(process.env.mongoDBUrl ).then(()=>{
    console.log('Database Connected');
    app.listen(process.env.port,()=>{
        console.log(`Listening on port ${process.env.port}`)
    });
}).catch((err)=>{
    console.log(err);
})

