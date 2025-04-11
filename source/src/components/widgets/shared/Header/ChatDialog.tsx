import { Avatar } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { debounce } from "lodash";
import { MessagesSquareIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { ChatSheet } from "../../components/ChatSheet";
import { useTranslate } from "react-admin";

export const ChatDialog = () => {
    const translate = useTranslate();
    const [chatOpen, setChatOpen] = useState(false);
    const debounced = debounce(setChatOpen, 120);

    return (
        <Sheet
            open={chatOpen}
            onOpenChange={isOpen => {
                debounced(isOpen);
            }}
            modal={true}>
            <SheetTrigger asChild>
                <div>
                    <Avatar
                        className={
                            chatOpen
                                ? "flex h-[60px] w-[60px] cursor-pointer items-center justify-center border-2 border-green-50 bg-green-50 text-neutral-100 transition-colors duration-150"
                                : "flex h-[60px] w-[60px] cursor-pointer items-center justify-center border-2 border-green-50 bg-muted text-green-50 transition-colors duration-150 hover:bg-green-50 hover:text-neutral-100"
                        }>
                        <MessagesSquareIcon className="h-[30px] w-[30px]" />
                    </Avatar>
                </div>
            </SheetTrigger>

            <SheetContent
                className="!top-[84px] m-0 !max-h-[calc(100vh-84px)] w-full p-0 sm:max-w-[520px]"
                close={false}>
                <SheetHeader className="bg-green-60 p-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-display-3">
                            {translate("app.ui.actions.chatWithSupport")}
                        </SheetTitle>

                        <button
                            tabIndex={-1}
                            onClick={() => setChatOpen(false)}
                            className="-tab-1 border-0 text-gray-500 outline-0 transition-colors hover:text-gray-700">
                            <XIcon className="h-[28px] w-[28px]" />
                        </button>
                    </div>
                </SheetHeader>

                <SheetDescription />

                <ChatSheet locale={"ru"} />
            </SheetContent>
        </Sheet>
    );
};
