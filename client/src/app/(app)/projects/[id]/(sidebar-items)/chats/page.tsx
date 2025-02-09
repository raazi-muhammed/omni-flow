"use client";

import { toast } from "@/components/ui/use-toast";

import Heading from "@/components/custom/Heading";
import React, { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { useAppSelector } from "@/redux/store";
import { EventTypes, IMessage } from "@/types/database";
import { ChatService } from "@/services/api/chat.service";
import { makeApiCall } from "@/lib/apicaller";
import { IResponse } from "@/services/api/utils";
import Messages from "./_components/Messages";
import MessageSender from "./_components/MessageSender";
import { logger } from "@/lib/logger";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
if (!SOCKET_URL) throw new Error("ENV NOT FOUND: socket url not found");

const socket = new WebSocket(SOCKET_URL);
enum ChatStates {
    CONNECTING = "Connecting",
    CONNECTED = "Connected",
    FAILED = "Failed",
}
export default function Chats() {
    const project = useAppSelector((state) => state.projectReducer.projectData);
    const user = useAppSelector((state) => state.authReducer.userData);
    const [chatState, setChatState] = useState<ChatStates>(
        ChatStates.CONNECTING
    );
    const [rejoin, setRejoin] = useState(new Date());
    const retryJoin = () => {
        toast({ description: "retrying" });

        rejoin.setSeconds(rejoin.getSeconds() + 1);
        if (rejoin < new Date()) setRejoin(new Date());
    };
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        const service = new ChatService();
        if (!project?.id) return;
        makeApiCall(() => service.getMessages({ roomId: project.id }).exec(), {
            afterSuccess: (response: IResponse) => {
                setMessages(response.data);
            },
        });
    }, [project]);

    useEffect(() => {
        try {
            if (!project?.id) {
                toast({ description: "No project id found" });
                return;
            }

            socket.send(
                JSON.stringify({
                    type: EventTypes.JOIN_ROOM,
                    roomId: project.id,
                })
            );
            setChatState(ChatStates.CONNECTED);
        } catch (error) {
            retryJoin();
            toast({ description: "Failed to join Chat" });
            setChatState(ChatStates.FAILED);
        }
        return () => {
            try {
                socket.send(
                    JSON.stringify({
                        type: EventTypes.LEAVE_ROOM,
                        roomId: project?.id,
                    })
                );
            } catch (error) {
                logger.error(error);
            }
        };
    }, [project, rejoin, socket.readyState]);

    socket.addEventListener("message", ({ data }) => {
        const messageData = JSON.parse(data);
        const message = messageData.content as IMessage;

        if (message.from.username == user?.username) {
            const updatedMessages = messages.map((e) => {
                if (e.content === message.content) {
                    return {
                        ...e,
                        isLoading: false,
                    };
                } else return e;
            });
            setMessages(updatedMessages);
        } else {
            setMessages([...messages, message]);
        }
    });

    return (
        <div className="relative w-full">
            <main className="h-screen-without-navbar w-full overflow-auto">
                <Container>
                    <section className="absolute left-0 right-0 top-0 z-20 bg-black bg-opacity-50 p-3 px-8 backdrop-blur-sm">
                        <Container className="grid gap-0">
                            <Heading>
                                {project ? project.title : "Chats"}
                            </Heading>
                            <small className="-mt-2 text-secondary">
                                {chatState}
                            </small>
                        </Container>
                    </section>
                    <Messages
                        messages={messages}
                        userName={user?.username || ""}
                    />
                    <section className="absolute bottom-4 left-0 right-0 w-full">
                        <Container>
                            {project && user ? (
                                <MessageSender
                                    projectId={project.id}
                                    user={user}
                                    messages={messages}
                                    setMessages={setMessages}
                                    socket={socket}
                                />
                            ) : null}
                        </Container>
                    </section>
                </Container>
            </main>
        </div>
    );
}
