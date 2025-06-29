import {WebSocketServer} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {

    const url = request.url;
    if (!url){
        return;
    }

    const queryParamters = new URLSearchParams(url.split('?')[1]);
    const token = queryParamters.get('token') || "";
    const decode = jwt.verify(token, JWT_SECRET);

    if (!decode || !(decode as JwtPayload).userId) {
        ws.close();
        return;
    }

    ws.on('message', function message(data){
        ws.send('pong');
    });

});