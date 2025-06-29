import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET); 

    if (decoded.userId) {
        req.userId  = decoded.userId;
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}