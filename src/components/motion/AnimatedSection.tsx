import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    delay?: number
}

export default function AnimatedSection({
    children,
    className = '',
    delay = 0
}: AnimatedSectionProps) {
    return (
        <motion.section
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.section>
    )
}
