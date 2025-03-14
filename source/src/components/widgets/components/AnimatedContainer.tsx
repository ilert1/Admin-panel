import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedContainerProps {
    open: boolean;
    children: ReactNode;
}

export const AnimatedContainer = (props: AnimatedContainerProps) => {
    const { open, children } = props;
    const [opened, setOpened] = useState(() => {
        return localStorage.getItem("filterOpened") === "true";
    });

    useEffect(() => {
        setOpened(open);
    }, [open]);

    return (
        <AnimatePresence>
            <motion.div
                layout
                initial={{ opacity: opened ? 1 : 0, height: opened ? "auto" : 0 }}
                animate={{
                    opacity: open ? 1 : 0,
                    height: open ? "auto" : 0,
                    pointerEvents: open ? "auto" : "none"
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}>
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
