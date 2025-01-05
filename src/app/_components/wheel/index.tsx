"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ComponentProps, useState } from "react";
import Link from "next/link";

import StyleHeader from "@/app/_components/style-header";

type StyleProps = ComponentProps<typeof StyleHeader> & {
  id: string;
};

interface WheelProps {
  styles: StyleProps[];
  defaultGradientStops: string[];
}

const Wheel = ({ styles, defaultGradientStops }: WheelProps) => {
  const radius = 5;
  const circumference = 2 * Math.PI * radius;
  const sliceSize = circumference / styles.length;

  const animationDuration = 5;
  const revealDuration = 0.25;

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [style, setStyle] = useState<StyleProps | null>(null);

  const spinWheel = () => {
    if (isSpinning) {
      return;
    }

    setIsSpinning(true);
    setStyle(null);

    const newRotation = rotation + (4 + Math.random()) * 360; // Spin at least 4 full rotations + random
    setRotation(newRotation);

    setTimeout(
      () => {
        setIsSpinning(false);

        const selectedIndex = Math.floor(
          (((newRotation + 90) % 360) / 360) * styles.length,
        );

        setStyle(styles[styles.length - 1 - selectedIndex]);
      },
      (animationDuration - revealDuration) * 1000,
    );
  };

  return (
    <div className="flex flex-col items-center gap-y-8">
      <div className="relative z-10 w-full max-w-[600px] cursor-pointer rounded-full border-8 border-black shadow-2xl">
        <div className="absolute left-1/2 top-3 z-50 h-0 w-0 -translate-x-1/2 -translate-y-1/2 transform border-l-[calc(2*theme(spacing.2))] border-r-[calc(2*theme(spacing.2))] border-t-[calc(4*theme(spacing.2))] border-l-transparent border-r-transparent border-t-black"></div>

        <motion.svg
          onClick={spinWheel}
          animate={{ rotate: rotation }}
          transition={{ duration: animationDuration, ease: "easeOut" }}
          viewBox={`0 0 ${4 * radius} ${4 * radius}`}
        >
          <radialGradient id="gradient-default" r="100%">
            {defaultGradientStops.map((stop, index) => (
              <stop
                key={index}
                offset={`${Math.round((index / defaultGradientStops.length) * 100)}%`}
                stopColor={stop}
              />
            ))}
          </radialGradient>

          {styles.map((style, index) =>
            style.srmMinColor && style.srmMaxColor ? (
              <radialGradient key={index} id={`gradient-${index}`} r="100%">
                <stop offset="0%" stopColor={style.srmMinColor}></stop>
                <stop offset="100%" stopColor={style.srmMaxColor}></stop>
              </radialGradient>
            ) : null,
          )}

          {styles.map((style, index) => (
            <circle
              key={index}
              r={radius}
              cx={2 * radius}
              cy={2 * radius}
              fill="transparent"
              stroke={`url(#gradient-${style.srmMinColor && style.srmMaxColor ? index : "default"})`}
              strokeWidth={2 * radius}
              strokeDasharray={`${sliceSize} ${circumference}`}
              strokeDashoffset={-index * sliceSize}
            />
          ))}
        </motion.svg>
      </div>

      {style && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, y: -200, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: revealDuration, ease: "easeOut" }}
          className="z-0 flex flex-col items-center gap-y-12"
        >
          <StyleHeader {...style} />

          <Link
            href={`/styles/${style.id}`}
            className="group flex w-fit flex-row gap-x-2 rounded-full border-2 border-foreground px-4 py-2 transition-all duration-300 hover:scale-105"
          >
            <span className="font-bold">Read more</span>
            <ArrowRight className="transition-all duration-300 group-hover:ml-1" />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Wheel;
