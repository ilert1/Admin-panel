import { RotatingLines } from "react-loader-spinner";

export const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
        </div>
    );
};
export const LoadingAlertDialog = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
        </div>
    );
};
