import Messageicon from "/BlowFishMessageIcon.svg";

export const MessageIcon = () => {
    return (
        <div className="flex h-[60px] w-[60px] min-w-[60px] items-center justify-center rounded-full border-[1px] border-green-40 bg-muted">
            <img src={Messageicon} />
        </div>
    );
};
