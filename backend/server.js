//console.log("bharat online shopping backend server is running...")


//const express = require('express');

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

// import dns from "dns";
// // Ensure Node uses reliable public DNS for SRV lookups (workaround for local DNS stub issues)
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from 'express';
import 'dotenv/config';
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import cors from 'cors';

import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000; 

// middeleware
app.use(express.json());


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://nexerastore.vercel.app"
  ],
  credentials: true
}))

// app.use(cors({
//   origin: "https://nexerastore.vercel.app",
//   credentials: true
// }))


// app.use(cors({
//     origin: true, // Allow all origins for development  meeeeee change it 
//     credentials: true, // Allow cookies to be sent with requests
// })) ;

// api creation
app.use('/api/v1/user' , userRoute)
app.use('/api/v1/product' , productRoute)
app.use('/api/v1/cart' , cartRoute)
app.use('/api/v1/orders' ,  orderRoute)


// http://localhost:8000/api/v1/user/register

app.get("/", (req, res) => {
  res.send("NexEraStore Backend Running Successfully 🚀");
});


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});