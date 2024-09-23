import Messageicon from "../../../public/BlowFishMessageIcon.svg";

export const MessageIcon = () => {
    return (
        <div
            className="rounded-full bg-red-40 h-[60px] w-[60px] min-w-[60px] flex items-center justify-center border-[1px] border-green-40"
            style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}>
            <img src={Messageicon} />
        </div>
    );
};
