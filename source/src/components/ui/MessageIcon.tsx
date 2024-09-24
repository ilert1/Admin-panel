import Messageicon from "/BlowFishMessageIcon.svg";

export const MessageIcon = () => {
    return (
        <div className="rounded-full h-[60px] w-[60px] min-w-[60px] flex items-center justify-center border-[1px] border-green-40 bg-muted">
            <img src={Messageicon} />
        </div>
    );
};
