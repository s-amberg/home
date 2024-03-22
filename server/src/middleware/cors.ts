import { NextFunction, Response, Request } from "express";


export function CORS(req: Request, res: Response, next: NextFunction) {
    const env = process.env.NODE_ENV || 'development';
    const allowedOrigins = env === 'developement' ? `http://localhost:3000`: "YOUR-DOMAIN.TLD"

    res.header("Access-Control-Allow-Origin", allowedOrigins); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    next();
};