import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMTA5YzJjNi1hZjg4LTQ1OTQtOGMzMy0xNzIzOTYxY2UwOTciLCJpYXQiOjE3NTEzMDgzNjh9.jslibv4np8OFNEqzV5pKpgesJbUz8740B_W32-ASbhQ`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}