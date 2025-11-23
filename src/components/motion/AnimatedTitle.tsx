import { motion } from 'framer-motion'

interface AnimatedTitleProps {
    children: string
    className?: string
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function AnimatedTitle({
    children,
    className = '',
    as = 'h2'
}: AnimatedTitleProps) {
    const Tag = motion[as]

    return (
        <Tag
            className={className}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </Tag>
    )
}
