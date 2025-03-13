import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedContainerProps {
    open: boolean;
    children: ReactNode;
}

export const AnimatedContainer = (props: AnimatedContainerProps) => {
    const { open, children } = props;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{
                opacity: open ? 1 : 0,
                height: open ? "auto" : 0,
                pointerEvents: open ? "auto" : "none"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            {children}
        </motion.div>
    );
};
