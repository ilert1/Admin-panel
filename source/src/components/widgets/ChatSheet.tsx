import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Message, MessageProps } from "./Message";
import { getMockMessages } from "@/data/mockMessages";
import { useTranslate } from "react-admin";

export interface ChatSheetProps {
    locale?: string;
}

export const ChatSheet = ({ locale = "ru" }: ChatSheetProps) => {
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [message, setMessage] = useState("");

    const translate = useTranslate();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            console.log("Scrolling to bottom");
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSendClicked = () => {
        if (message.trim()) {
            setMessages(prevMessages => [...prevMessages, { text: message, icon: false, isUserMessage: true }]);
            setMessage("");
            focusInput();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendClicked();
            focusInput();
        }
    };

    useEffect(() => {
        const mockMessages = getMockMessages();
        setMessages(mockMessages);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addSupportMessage = (text: string) => {
        setMessages(prevMessages => [...prevMessages, { text, icon: true, isUserMessage: false }]);
    };

    useEffect(() => {
        window.addSupportMessage = addSupportMessage;

        // Очистить свойство, когда компонент размонтируется (на случай перезаписи или утечек)
        return () => {
            window.addSupportMessage ? delete window.addSupportMessage : "";
        };
    }, []);
    return (
        <div className="flex flex-col" style={{ height: "calc(100vh - 144px)" }} tabIndex={-1}>
            <div
                tabIndex={-1}
                ref={messagesContainerRef}
                className="bg-neutral-0 flex-auto overflow-y-auto pb-4"
                style={{ maxHeight: "calc(100vh - 200px)" }}>
                <div className="flex flex-col gap-2 pt-[24px]">
                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            text={message.text}
                            icon={message.icon}
                            isUserMessage={message.isUserMessage}
                            timestamp={message.timestamp}
                            locale={locale}
                        />
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
            <div className="h-[92px] bg-muted p-4 flex items-center gap-4" tabIndex={-1}>
                <Input
                    className="h-[60px] flex-grow"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={translate("app.ui.chatMessagePlaceholder")}
                    ref={inputRef}
                    autoFocus
                    tabIndex={1}
                />
                <Button className="h-[60px] w-[60px]" disabled={!message.trim()} onClick={handleSendClicked}>
                    <Send className="w-[40px] h-[40px]" />
                </Button>
            </div>
        </div>
    );
};
