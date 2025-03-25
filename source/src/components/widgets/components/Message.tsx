import { TextField } from "../../ui/text-field";
import { MessageIcon } from "../../ui/MessageIcon";
import { MessageTime } from "../../ui/MessageTime";

export interface MessageProps {
    text: string;
    isUserMessage: boolean; // Если написал пользователь то true, если собеседник - false
    icon?: boolean;
    locale?: string;
    timestamp?: number;
}

export const Message = (props: MessageProps) => {
    const { text = "", icon, isUserMessage = false, timestamp = 0, locale = "ru" } = props;

    return (
        <>
            {!isUserMessage && (
                <div className="flex items-start gap-3 px-4">
                    {icon && <MessageIcon />}
                    <div className="flex max-w-full flex-col items-start pt-0">
                        <div className="w-fit max-w-xs break-words rounded-r-22 rounded-tl-22 bg-muted px-4 py-[19px] text-title-2 text-neutral-100 lg:max-w-md">
                            <TextField text={text} wrap={true} />
                        </div>
                        <MessageTime locale={locale} timestamp={timestamp} />
                    </div>
                </div>
            )}

            {isUserMessage && (
                <div className={`flex items-start justify-end gap-3 px-4`}>
                    <div className="flex max-w-full flex-col items-end pt-0">
                        <div className="flex justify-end">
                            <div className="w-fit max-w-xs break-words rounded-l-22 rounded-tr-22 bg-green-40 px-4 py-[19px] text-title-2 text-neutral-0 lg:max-w-md">
                                <TextField text={text} wrap={true} />
                            </div>
                        </div>
                        <MessageTime locale={locale} timestamp={timestamp} />
                    </div>
                    {icon && <MessageIcon />}
                </div>
            )}
        </>
    );
};
