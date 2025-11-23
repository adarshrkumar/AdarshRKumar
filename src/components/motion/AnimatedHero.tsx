import { motion } from 'framer-motion'

interface AnimatedHeroProps {
    title: string
    subtitle: string
    tagline?: string
    className?: string
}

export default function AnimatedHero({
    title,
    subtitle,
    tagline,
    className = ''
}: AnimatedHeroProps) {
    return (
        <motion.section
            className={`hero ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                }}
            >
                {title}
            </motion.h1>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                }}
            >
                {subtitle}
            </motion.h2>
            {tagline && (
                <motion.h3
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.6,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                >
                    {tagline}
                </motion.h3>
            )}
        </motion.section>
    )
}
