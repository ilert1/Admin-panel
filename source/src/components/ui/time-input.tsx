import { InputMask, Track } from "@react-input/mask";
import { cn } from "@/lib/utils";

interface IProps {
    time: string;
    setTime: (time: string) => void;
    className?: string;
    disabled?: boolean;
    error?: boolean;
}

function TimeInput({ time, setTime, className, disabled, error }: IProps) {
    const handleInput = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setTime(value);

    const track: Track = ({ data, selectionStart }) => {
        const firstNumberCheck = selectionStart === 0 && data?.match(/[0-2]/);
        const secondNumberCheck =
            selectionStart === 1 &&
            ((time[0] === "2" && data?.match(/[0-3]/)) || (time[0] !== "2" && data?.match(/[0-9]/)));
        const thirdNumberCheck = selectionStart === 2 && data?.match(/[0-5]/);
        const fourthNumberCheck = selectionStart === 4 && data?.match(/[0-9]/);

        if (firstNumberCheck || secondNumberCheck || thirdNumberCheck || fourthNumberCheck) {
            return data;
        }

        return "";
    };

    return (
        <InputMask
            className={cn(
                "relative flex-1 w-12 border hover:border-green-40 dark:border-neutral-60 border-neutral-40 hover:dark:border-green-40 transition-colors duration-200 focus-visible:border-green-50 disabled:border-neutral-40 disabled:hover:border-neutral-40 text-center text-sm placeholder:text-neutral-70 h-9 px-3 py-2 rounded-4 ring-offset-background focus:outline-none z-1 text-neutral-80 bg-neutral-0 dark:text-neutral-0 dark:bg-neutral-100 dark:placeholder:text-neutral-70 disabled:bg-neutral-20 disabled:dark:bg-neutral-90 disabled:text-neutral-80 disabled:dark:text-neutral-60",
                className,
                error && "!border-red-50"
            )}
            disabled={disabled}
            mask={"__:__"}
            placeholder="00:00"
            onChange={handleInput}
            value={time}
            replacement={{ _: /\d/ }}
            track={track}
        />
    );
}

export { TimeInput };
