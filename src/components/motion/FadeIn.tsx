import { motion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    duration?: number
}

const directionMap = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {}
}

export default function FadeIn({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 0.5
}: FadeInProps) {
    const directionOffset = directionMap[direction]

    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                className={className}
                initial={{ opacity: 0, ...directionOffset }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                    duration,
                    delay,
                    ease: [0.4, 0, 0.2, 1]
                }}
            >
                {children}
            </motion.div>
        </MotionConfig>
    )
}
