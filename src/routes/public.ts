import express from 'express';

export const publicRoutes = express.Router();

publicRoutes.get("/", (req, res) => {    
    res.json({
        message: `Welcome to ${process.env.APP_NAME || "Perpustakaan Unsurya Backend"}`,
        version: '1.0.0'
    })
})