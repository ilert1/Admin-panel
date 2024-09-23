import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessagesSquareIcon, Send, XIcon } from "lucide-react"; // используем XIcon для кастомной кнопки закрытия
import { useState } from "react";
import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Message } from "../ui/Message";

// export interface ChatSheetProps {
//     open?: boolean;
// }

export const ChatSheet = () => {
    const [conversationOpen, setConversationOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendClicked = () => {};

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
                        <Message text="Привет! Здесь можно задать любой вопрос asdas das dasd" icon={true} />
                        <Message
                            text="Вы можете перейти в раздел “История операций” в боковом меню и увидеть статус всех операций"
                            isUserMessage={true}
                            icon={false}
                        />
                    </div>
                    <div
                        className="h-[92px] bg-neutral-10 px-4 flex items-center gap-4"
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}>
                        <Input
                            className="h-[60px] flex-grow"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                        <Button
                            className="h-[60px] w-[60px]"
                            disabled={message.length ? false : true}
                            onClick={handleSendClicked}>
                            <Send className="w-[40px] h-[40px]" />
                        </Button>
                    </div>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    );
};
