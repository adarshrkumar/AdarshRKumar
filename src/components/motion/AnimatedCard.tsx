import { motion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import '../../styles/components/animatedCard.scss'

interface AnimatedCardProps {
    children: ReactNode
    index?: number
    className?: string
    href?: string
    target?: string
}

export default function AnimatedCard({
    children,
    index = 0,
    className = '',
    href,
    target
}: AnimatedCardProps) {
    const content = (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
                duration: 0.4,
                delay: Math.min(index * 0.08, 0.4),
                ease: [0.4, 0, 0.2, 1]
            }}
            whileHover={{
                y: -6,
                transition: { duration: 0.2, ease: 'easeOut' }
            }}
        >
            {children}
        </motion.div>
    )

    if (href) {
        return (
            <MotionConfig reducedMotion="user">
                <motion.a href={href} target={target} className="animated-card-link">
                    {content}
                </motion.a>
            </MotionConfig>
        )
    }

    return (
        <MotionConfig reducedMotion="user">
            {content}
        </MotionConfig>
    )
}
