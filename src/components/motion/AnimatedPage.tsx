import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedPageProps {
    children: ReactNode
    className?: string
}

export default function AnimatedPage({
    children,
    className = ''
}: AnimatedPageProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: 'easeOut'
            }}
        >
            {children}
        </motion.div>
    )
}
