import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedGridProps {
    children: ReactNode
    className?: string
    id?: string
    style?: React.CSSProperties
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

export default function AnimatedGrid({
    children,
    className = '',
    id,
    style
}: AnimatedGridProps) {
    return (
        <motion.section
            id={id}
            className={className}
            style={style}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
        >
            {children}
        </motion.section>
    )
}
