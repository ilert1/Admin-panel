import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessagesSquareIcon, Send, XIcon } from "lucide-react"; // используем XIcon для кастомной кнопки закрытия
import { useEffect, useRef, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Message, MessageProps } from "./Message";
import { getMockMessages } from "@/data/mockMessages";

export const ChatSheet = () => {
    const [conversationOpen, setConversationOpen] = useState(false);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessages(getMockMessages());
    }, []);

    const handleSendClicked = () => {
        if (message.trim()) {
            setMessages(prevMessages => [...prevMessages, { text: message, icon: false, isUserMessage: true }]);
            setMessage("");
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100); // Небольшая задержка для корректной работы
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendClicked();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, conversationOpen]);

    const addSupportMessage = (text: string) => {
        setMessages(prevMessages => [...prevMessages, { text, icon: true, isUserMessage: false }]);
    };

    useEffect(() => {
        window.addSupportMessage = addSupportMessage;

        // Очистить свойство, когда компонент размонтируется (на случай перезаписи или утечек)
    }, []);
    console.log(message);
    return (
        <Sheet onOpenChange={() => setConversationOpen(prev => !prev)} open={conversationOpen}>
            <SheetTrigger>
                <div>
                    <Avatar
                        className={
                            conversationOpen
                                ? "flex items-center justify-center cursor-pointer w-[60px] h-[60px] text-neutral-100 border-2 border-green-50 bg-green-50 transition-colors duration-150"
                                : "flex items-center justify-center cursor-pointer w-[60px] h-[60px] text-green-50 hover:text-neutral-100 border-2 border-green-50 bg-muted hover:bg-green-50 transition-colors duration-150"
                        }>
                        <MessagesSquareIcon className="h-[30px] w-[30px]" />
                    </Avatar>
                </div>
            </SheetTrigger>
            <SheetContent
                className="sm:max-w-[520px] !top-[84px] !max-h-[calc(100vh-84px)] w-full p-0 m-0 "
                close={false}>
                <SheetHeader className="p-4 bg-green-60">
                    <div className="flex justify-between items-center ">
                        <SheetTitle className="text-display-3">Чат с поддержкой</SheetTitle>
                        <button
                            onClick={() => setConversationOpen(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors">
                            <XIcon className="h-[28px] w-[28px]" />
                        </button>
                    </div>
                </SheetHeader>
                <SheetDescription className="flex flex-col" style={{ height: "calc(100vh - 144px)" }}>
                    <div className="bg-neutral-0 flex-auto overflow-y-auto pb-4">
                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                text={message.text}
                                icon={message.icon}
                                isUserMessage={message.isUserMessage}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div
                        className="h-[92px] bg-neutral-10 px-4 flex items-center gap-4"
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}>
                        <Input
                            className="h-[60px] flex-grow"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button className="h-[60px] w-[60px]" disabled={!message.trim()} onClick={handleSendClicked}>
                            <Send className="w-[40px] h-[40px]" />
                        </Button>
                    </div>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    );
};
