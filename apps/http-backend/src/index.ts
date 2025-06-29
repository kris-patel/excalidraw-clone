import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema} from "@repo/common/types";

const app = express()

app.use();

app.post('/signin', (req, res) => {

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })

})

app.post('/siginup', (req ,res) => {

    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return; 
    }

})

app.post('/room', middleware, (req,res) => {

    res.json({
        roomId: "123"
    })
    
})

app.listen(3001);