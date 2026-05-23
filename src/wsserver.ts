import { env } from "process";
import WebSocket, { WebSocketServer } from "ws";
import server from "./server.js";
import { HTTPMethods } from "fastify";
import { WsAuthenticate } from "./services/AuthService.js";
import { Store } from "./db/models.js";

export const wss = new WebSocketServer({
    port: 9951
});


export interface BaseWsMessage {
    id: string;
}



export interface WsAuthPayload {
    token: string;
}

export interface WsRequestPayload<T = any> {
    method: HTTPMethods;
    url: string;
    body?: T;
}

export interface WsResponsePayload<T = any> {
    status: number;
    body?: T;
    error?: string;
}

export interface WsAuthMessage extends BaseWsMessage {
    type: "auth";

    payload: WsAuthPayload;
}


export interface WsRequestMessage<T = any> extends BaseWsMessage {
    type: "request";
    payload: WsRequestPayload<T>;
}

export interface WsResponseMessage<
    T = any
> extends BaseWsMessage {

    type: "response";

    payload: WsResponsePayload<T>;
}

export type WsMessage =
    | WsAuthMessage
    | WsRequestMessage
    | WsResponseMessage;



function generateRequestId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const pendingRequests: Map<string, { promise: Promise<WsResponseMessage>, resolve: (res: WsResponseMessage) => void, reject: (err: any) => void }> = new Map();

export async function MakeWsRequest(storeToken:string, payload: WsRequestPayload) {
    const socket = authenticatedClients.get(storeToken);
    if(!socket || !socket.isAuthenticated){
        throw new Error("Store not authenticated or WebSocket connection not established");
    }
    const id = generateRequestId();
    const message: WsRequestMessage = {
        id,
        type: "request",
        payload: payload
    };

    socket.send(JSON.stringify(message));
    let resolveFunc: (res: WsResponseMessage) => void = () => { };
    let rejectFunc: (err: any) => void = () => { };

    const promise = new Promise<WsResponseMessage>((resolve, reject) => {
        resolveFunc = resolve;
        rejectFunc = reject;
    })

    pendingRequests.set(id, { promise, resolve: resolveFunc, reject: rejectFunc });
    return promise

}


wss.on("listening", () => {
    console.log("WebSocket server started on port 9951");
});


type SocketClient = WebSocket & { isAuthenticated?: boolean, store?: Store };

const authenticatedClients = new Map<string, SocketClient>();


export function isStoreAuthenticated(storeToken: string): boolean {
    const socket = authenticatedClients.get(storeToken);
    return !!socket && socket.isAuthenticated === true;
}

wss.on("connection", (socket: SocketClient) => {

    wss.on('close', () => {
        if(socket.store){
            authenticatedClients.delete(socket.store.storeToken);
        }
    })

    socket.on("message", async (raw) => {
        try {
            const message: WsMessage = JSON.parse(raw.toString());
            console.log("Received WebSocket message", message);
            if (message.type === "request" && socket.isAuthenticated) {
                const response = await server.inject({
                    method: message.payload.method as any,
                    url: message.payload.url,
                    payload: message.payload.body as any
                });

                const responseMessage: WsResponseMessage = {
                    id: message.id,
                    type: "response",
                    payload: {
                        status: response.statusCode,
                        body: response.json(),
                        error: response.statusCode >= 400 ? response.statusMessage : undefined
                    }
                };

                socket.send(JSON.stringify(responseMessage));
            }

            else if (message.type === "response"  && socket.isAuthenticated) {
                const pending = pendingRequests.get(message.id);
                if (pending) {
                    if (message.payload.status >= 400) {
                        pending.reject(message.payload.error);
                    }
                    else {
                        pending.resolve(message.payload.body as WsResponseMessage);
                    }

                }
            }
            else if (message.type === "auth") {
                const store = await WsAuthenticate(message.payload.token);
                if(store){
                    socket.isAuthenticated = true;
                    socket.store = store;
                    authenticatedClients.set(message.payload.token, socket);


                const responseMessage: WsAuthMessage = {
                    id: message.id,
                    type: "auth",
                    payload: {
                        token: message.payload.token
                    }
                };

                socket.send(JSON.stringify(responseMessage));

                }
                else{
                    socket.isAuthenticated = false;
                     const responseMessage: WsAuthMessage = {
                    id: message.id,
                    type: "auth",
                    payload: {
                        //@ts-ignore
                        token: null
                    }
                };

                socket.send(JSON.stringify(responseMessage));
                }
                if (message.payload.token) {
                    console.log("WebSocket authentication successful");
                }
                else {
                    console.error("WebSocket authentication failed");
                    socket.close();
                }
            }

        }
        catch (err) {
            console.error("Failed to parse message", err);
            return;
        }
    });
})

