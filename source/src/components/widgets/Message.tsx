import { TextField } from "../ui/text-field";
import { MessageIcon } from "../ui/MessageIcon";
import { MessageTime } from "../ui/MessageTime";

export interface MessageProps {
    text: string;
    isUserMessage: boolean; // Если написал пользователь то true, если собеседник - false
    icon?: boolean;
}

export const Message = (props: MessageProps) => {
    const { text = "", icon, isUserMessage = false } = props;

    return (
        <>
            {!isUserMessage && (
                <div className="flex gap-3 items-start px-4 pt-[24px]">
                    {icon && <MessageIcon />}
                    <div className="flex flex-col items-start max-w-full pt-0">
                        <div className="text-neutral-100 w-fit max-w-xs lg:max-w-md px-4 py-[19px] text-title-2 rounded-r-22 rounded-tl-22 break-words bg-muted">
                            <TextField text={text} wrap={true} />
                        </div>
                        <MessageTime />
                    </div>
                </div>
            )}

            {isUserMessage && (
                <div className={`flex gap-3 items-start justify-end px-4 pt-[24px]`}>
                    <div className="flex flex-col items-end max-w-full pt-0">
                        <div className="flex justify-end">
                            <div className="text-neutral-0 w-fit max-w-xs lg:max-w-md px-4 py-[19px] text-title-2 rounded-l-22 rounded-tr-22 break-words bg-green-40">
                                <TextField text={text} wrap={true} />
                            </div>
                        </div>
                        <MessageTime />
                    </div>
                    {icon && <MessageIcon />}
                </div>
            )}
        </>
    );
};
