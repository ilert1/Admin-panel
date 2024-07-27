import { RotatingLines } from "react-loader-spinner";

export const Loading = () => {
    return (
        <div className="absolute h-screen w-screen  top-2/4 left-2/4">
            <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
        </div>
    );
};
