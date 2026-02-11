import { Variants } from "framer-motion";

export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotate: -20 },
    visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: {
            type: "tween",
            damping: 12,
            stiffness: 200
        },
    },
};