"use client";

import { motion, HTMLMotionProps } from "motion/react";
import { ReactNode } from "react";

/**
 * AnimatedWrapper - A reusable animated wrapper component
 * Provides smooth animations for UI components using Framer Motion
 * 
 * @param children - Child elements to animate
 * @param animationType - Type of animation (fade, slide, scale, etc.)
 * @param className - Additional CSS classes
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 * @param props - Additional HTML motion props
 */
interface AnimatedWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  animationType?: "fade" | "slide" | "scale" | "slideIn" | "slideUp" | "slideDown";
  className?: string;
  delay?: number;
  duration?: number;
}

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  slideIn: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
};

export function AnimatedWrapper({
  children,
  animationType = "fade",
  className = "",
  delay = 0,
  duration = 0.2,
  ...props
}: AnimatedWrapperProps) {
  const variant = animationVariants[animationType];

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggeredChildren - Wrapper for animating children with staggered delays
 * Useful for lists and grids where items should animate in sequence
 */
interface StaggeredChildrenProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

export function StaggeredChildren({
  children,
  className = "",
  staggerDelay = 0.05,
  duration = 0.2,
  ...props
}: StaggeredChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            duration,
          },
        },
        hidden: {},
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggeredItem - Individual item for use with StaggeredChildren
 */
interface StaggeredItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export function StaggeredItem({
  children,
  className = "",
  ...props
}: StaggeredItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * LoadingSkeleton - Animated skeleton placeholder
 * Provides a shimmer effect while content is loading
 */
interface LoadingSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  variant?: "text" | "rect" | "circle";
}

export function LoadingSkeleton({
  className = "",
  height = "h-4",
  width = "w-full",
  variant = "rect",
}: LoadingSkeletonProps) {
  const variantStyles = {
    text: "rounded",
    rect: "rounded-md",
    circle: "rounded-full",
  };

  return (
    <motion.div
      className={`bg-muted ${variantStyles[variant]} ${height} ${width} ${className}`}
      animate={{
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * PulseAnimation - Adds a pulsing animation to children
 * Useful for drawing attention to important elements
 */
interface PulseAnimationProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}

export function PulseAnimation({
  children,
  className = "",
  intensity = 0.1,
  duration = 2,
}: PulseAnimationProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1 + intensity, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * HoverScale - Adds a scale animation on hover
 * Provides visual feedback for interactive elements
 */
interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function HoverScale({
  children,
  className = "",
  scale = 1.05,
  duration = 0.2,
}: HoverScaleProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}

/**
 * PressScale - Adds a scale animation on press/click
 * Provides tactile feedback for buttons and interactive elements
 */
interface PressScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function PressScale({
  children,
  className = "",
  scale = 0.95,
  duration = 0.1,
}: PressScaleProps) {
  return (
    <motion.div
      className={className}
      whileTap={{ scale }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}
