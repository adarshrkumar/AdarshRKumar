import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedGridItemProps {
    children: ReactNode
    index?: number
    className?: string
    href?: string
    target?: string
    as?: 'a' | 'div' | 'label'
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            delay: index * 0.1,
            ease: [0.4, 0, 0.2, 1]
        }
    })
}

export default function AnimatedGridItem({
    children,
    index = 0,
    className = '',
    href,
    target,
    as = 'div'
}: AnimatedGridItemProps) {
    const Component = as === 'a' ? motion.a : as === 'label' ? motion.label : motion.div

    return (
        <Component
            className={className}
            href={as === 'a' ? href : undefined}
            target={as === 'a' ? target : undefined}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={index}
            whileHover={{
                y: -4,
                transition: { duration: 0.2 }
            }}
        >
            {children}
        </Component>
    )
}
