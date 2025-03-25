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
        const thirdNumberCheck = (selectionStart === 2 || selectionStart === 3) && data?.match(/[0-5]/);
        const fourthNumberCheck = selectionStart === 4 && data?.match(/[0-9]/);

        if (firstNumberCheck || secondNumberCheck || thirdNumberCheck || fourthNumberCheck) {
            return data;
        }

        return "";
    };

    return (
        <InputMask
            className={cn(
                "z-1 relative h-9 w-12 flex-1 rounded-4 border border-neutral-40 bg-neutral-0 px-3 py-2 text-center text-sm text-neutral-80 ring-offset-background transition-colors duration-200 placeholder:text-neutral-70 hover:border-green-40 focus:outline-none focus-visible:border-green-50 disabled:border-neutral-40 disabled:bg-neutral-20 disabled:text-neutral-80 disabled:hover:border-neutral-40 dark:border-neutral-60 dark:bg-neutral-100 dark:text-neutral-0 dark:placeholder:text-neutral-70 hover:dark:border-green-40 disabled:dark:bg-neutral-90 disabled:dark:text-neutral-60",
                className,
                error && "!border-red-50"
            )}
            disabled={disabled}
            mask={"__:__"}
            showMask
            placeholder="00:00"
            onChange={handleInput}
            value={time}
            replacement={{ _: /\d/ }}
            track={track}
        />
    );
}

export { TimeInput };
