import { useState, useEffect, useRef } from "react";

const useIsOutOfView = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOut, setIsOut] = useState(false);

    useEffect(() => {
        const checkPosition = () => {
            if (ref.current) {
                const { top, bottom } = ref.current.getBoundingClientRect();
                setIsOut(top >= window.innerHeight || bottom <= 0);
            }
        };

        window.addEventListener("scroll", checkPosition);
        checkPosition();

        return () => {
            window.removeEventListener("scroll", checkPosition);
        };
    }, []);

    return { ref, isOut };
};

export default useIsOutOfView;
