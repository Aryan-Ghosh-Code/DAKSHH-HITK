"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface LandingEjectionProps {
	setDisplayHeroSection: Dispatch<SetStateAction<boolean>>;
}

const LandingEjection = ({ setDisplayHeroSection }: LandingEjectionProps) => {
	return (
		<motion.div
			initial={{ x: "100vw", rotate: 0 }}
			animate={{ x: "-100vw", rotate: 360 * 4 }}
			transition={{
				duration: 8,
				ease: "linear",
				repeat: 0
			}}
			onAnimationComplete={() => {
				setDisplayHeroSection(true);
			}}
			className="z-50 absolute pointer-events-none"
		>
			<Image
				src="/8.png"
				alt="Eject"
				width={130}
				height={130}
			/>
		</motion.div>
	)
}

export default LandingEjection;