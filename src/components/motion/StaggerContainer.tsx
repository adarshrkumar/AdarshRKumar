import { motion, MotionConfig, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerContainerProps {
    children: ReactNode
    className?: string
    id?: string
    style?: React.CSSProperties
    staggerDelay?: number
}

const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

export const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    }
}

export default function StaggerContainer({
    children,
    className = '',
    id,
    style
}: StaggerContainerProps) {
    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                id={id}
                className={className}
                style={style}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
            >
                {children}
            </motion.div>
        </MotionConfig>
    )
}
