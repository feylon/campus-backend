import rateLimit from "express-rate-limit";


const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 1000, 
    message: 'Too many requests from this IP, please try again after an hour',
    statusCode: 429, 
  });


export  {limiter}