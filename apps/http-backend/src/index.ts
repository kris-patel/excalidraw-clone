import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
import bcrypt from "bcrypt";
import cors from 'cors';


const saltRounds = 10;

const app = express()

app.use(express.json());
app.use(cors({origin: '*'}));

app.post('/signin', async (req, res) => {
    
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success){
        res.status(400).json({
            message: "Incorrect inputs"
        })
        return; 
    }

    try{
        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.username
            }
        })

        if (user){
            const match = await bcrypt.compare(parsedData.data.password, user.password);
            if (match){
                const userId = user.id;
                const token = jwt.sign({
                    userId
                }, JWT_SECRET);
            
                res.json({
                    token
                })
            }
        else {
            res.json({
                message: "wrong password"
            })
        }
        } else {
            res.json({
                message: "Not Authorized"
            })
        }

    } catch (e) {
        res.status(411).json({
            message: "Incorrect password / no such user exists"
        })
    }

})

app.post('/signup', async (req ,res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success){
        res.json({
            message: "Incorrect inputs"
        })
        return; 
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, saltRounds);
        await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        res.json({
            message: "added user"
        })
    } catch(e) {
        res.status(411).json({
            message: "User with this email already exists"
        })
    }
})

app.post('/room', middleware, async (req,res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success){
        res.json({
            message: "Incorrect inputs"
        })
        return; 
    }

    const userId = req.userId;
    if (userId) {

        try{
            const room = await prismaClient.room.create({
                data: {
                    slug: parsedData.data.name,
                    adminId: userId 
                }
            })
            res.json({
                roomId: room.id
            })
        } catch (e) {
            res.status(411).json({
                message: "Room already exists with this name"
            })
        }
    } else {
        res.json({
            message: "You are not logged in"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        }, 
        orderBy: {
            "id" : "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(3001);