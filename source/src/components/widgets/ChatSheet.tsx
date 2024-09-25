import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessagesSquareIcon, Send, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Message, MessageProps } from "./Message";
import { getMockMessages } from "@/data/mockMessages";
import { useTranslate } from "react-admin";

export interface ChatSheetProps {
    locale?: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const ChatSheet = ({ locale = "ru", open = false, onOpenChange }: ChatSheetProps) => {
    // const [conversationOpen, setConversationOpen] = useState(false);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [message, setMessage] = useState("");

    const translate = useTranslate();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

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
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendClicked();
        }
    };

    useEffect(() => {
        const mockMessages = getMockMessages();
        setMessages(mockMessages);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            // Проверяем, когда добавляются новые сообщения, чтобы прослушивать DOM-изменения
            const observer = new MutationObserver(() => {
                scrollToBottom();
            });

            if (messagesContainerRef.current) {
                observer.observe(messagesContainerRef.current, {
                    childList: true,
                    subtree: true
                });
            }

            // Очищаем observer при размонтировании
            return () => {
                observer.disconnect();
            };
        }
    }, [messages]);

    return (
        <Sheet open={open}>
            <SheetTrigger onClick={() => onOpenChange(!open)}>
                <div>
                    <Avatar
                        className={
                            open
                                ? "flex items-center justify-center cursor-pointer w-[60px] h-[60px] text-neutral-100 border-2 border-green-50 bg-green-50 transition-colors duration-150"
                                : "flex items-center justify-center cursor-pointer w-[60px] h-[60px] text-green-50 hover:text-neutral-100 border-2 border-green-50 bg-muted hover:bg-green-50 transition-colors duration-150"
                        }>
                        <MessagesSquareIcon className="h-[30px] w-[30px]" />
                    </Avatar>
                </div>
            </SheetTrigger>
            <SheetContent
                className="sm:max-w-[520px] !top-[84px] !max-h-[calc(100vh-84px)] w-full p-0 m-0"
                close={false}>
                <SheetHeader className="p-4 bg-green-60">
                    <div className="flex justify-between items-center ">
                        <SheetTitle className="text-display-3">
                            {translate("app.ui.actions.chatWithSupport")}
                        </SheetTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors">
                            <XIcon className="h-[28px] w-[28px]" />
                        </button>
                    </div>
                </SheetHeader>
                <SheetDescription></SheetDescription>
                <div className="flex flex-col" style={{ height: "calc(100vh - 144px)" }}>
                    <div
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
                                    locale={locale}
                                />
                            ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="h-[92px] bg-muted p-4 flex items-center gap-4">
                        <Input
                            className="h-[60px] flex-grow"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={translate("app.ui.chatMessagePlaceholder")}
                        />
                        <Button className="h-[60px] w-[60px]" disabled={!message.trim()} onClick={handleSendClicked}>
                            <Send className="w-[40px] h-[40px]" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
