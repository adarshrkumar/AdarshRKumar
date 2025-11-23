import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionProviderProps {
    children: ReactNode
}

/**
 * MotionProvider wraps children with Framer Motion's MotionConfig
 * to automatically respect the user's prefers-reduced-motion setting.
 *
 * When reducedMotion="user" is set, Framer Motion will:
 * - Check the user's system preference for reduced motion
 * - Disable all animations when prefers-reduced-motion: reduce is set
 * - Show the final state immediately without animation
 */
export default function MotionProvider({ children }: MotionProviderProps) {
    return (
        <MotionConfig reducedMotion="user">
            {children}
        </MotionConfig>
    )
}
