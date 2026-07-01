import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import {
    ArrowRight, Loader2, AlertCircle, CheckCircle2,
    ChevronDown, BriefcaseBusiness, Sparkles,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Service } from '@/types/database';

/* ── Section props ──────────────────────────────────────────────────────── */
interface ServicesProps {
    variant?: 'full' | 'featured';
    featuredLimit?: number;
    ctaHref?: string;
    ctaLabel?: string;
    sectionId?: string;
}

/** Renders any Lucide icon by PascalCase name string. */
const LucideIcon = ({ name, className = '' }: { name?: string; className?: string }) => {
    if (!name) return null;
    const Ic = (Icons as Record<string, React.ElementType>)[name];
    return Ic ? <Ic className={className} /> : null;
};

/* ── ServiceCard ─────────────────────────────────────────────────────────── */
interface CardProps {
    service: Service;
    index: number;
    isFeaturedVariant: boolean;
}

const ServiceCard = ({ service, index, isFeaturedVariant }: CardProps) => {
    const [expanded, setExpanded] = useState(false);
    const toggle = useCallback(() => setExpanded(p => !p), []);

    const hasFeatures = Array.isArray(service.features) && service.features.length > 0;

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col"
            aria-label={service.title}
        >
            {/* ── Card shell ── */}
            <div className="relative flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl
                border border-[rgba(15,23,42,0.12)] dark:border-[rgba(255,142,142,0.2)]
                bg-[#fffefe] dark:bg-[rgba(12,0,4,0.9)]
                shadow-[0_8px_28px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                group-hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] dark:group-hover:shadow-[0_22px_55px_rgba(0,0,0,0.65)]
                group-hover:-translate-y-1.5
                group-hover:border-[rgba(15,23,42,0.18)] dark:group-hover:border-[rgba(255,111,111,0.35)]
                transition-all duration-300 will-change-transform"
            >
                {/* Top gradient accent bar */}
                <div
                    aria-hidden
                    className="h-[3px] w-full bg-gradient-to-r from-primary via-secondary to-accent"
                />

                {/* Card number badge */}
                <span
                    aria-hidden
                    className="absolute top-4 right-5 text-[10px] font-mono font-bold tracking-[0.2em]
                        text-primary/20 group-hover:text-primary/45 transition-colors duration-300"
                >
                    {String(index + 1).padStart(2, '0')}
                </span>

                {/* ── Body ── */}
                <div className="relative z-10 p-6 sm:p-8 flex flex-col flex-1">

                    {/* Icon container */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-5
                        flex items-center justify-center
                        bg-primary/10 border border-primary/20 text-primary
                        group-hover:scale-110
                        group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary
                        group-hover:text-primary-foreground group-hover:border-transparent
                        group-hover:shadow-md
                        transition-all duration-500 will-change-transform"
                    >
                        <LucideIcon name={service.icon} className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold leading-snug mb-3
                        group-hover:text-primary transition-colors duration-300">
                        {service.title}
                    </h3>

                    {/* Description — clamped in collapsed state */}
                    <p className={`text-sm sm:text-[0.93rem] text-muted-foreground leading-relaxed
                        ${!expanded ? 'line-clamp-3' : ''}`}>
                        {service.description}
                    </p>

                    {/* ── Features accordion ── */}
                    {hasFeatures && (
                        <div className="mt-5">
                            <div className="border-t border-border/50 pt-4">

                                {/* Toggle row */}
                                <button
                                    onClick={toggle}
                                    className="flex items-center justify-between w-full text-left
                                        focus-visible:outline-none focus-visible:ring-2
                                        focus-visible:ring-primary/50 rounded group/tog"
                                    aria-expanded={expanded}
                                    aria-controls={`features-${service.id}`}
                                >
                                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em]
                                        text-foreground/45 group-hover/tog:text-primary
                                        transition-colors duration-200">
                                        What's Included
                                    </span>
                                    <span className="flex items-center gap-1 text-[0.7rem] font-semibold
                                        text-muted-foreground group-hover/tog:text-primary
                                        transition-colors duration-200">
                                        {expanded ? 'Show less' : 'Read more'}
                                        <motion.span
                                            animate={{ rotate: expanded ? 180 : 0 }}
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                        >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </motion.span>
                                    </span>
                                </button>

                                {/* Animated features list */}
                                <AnimatePresence initial={false}>
                                    {expanded && (
                                        <motion.ul
                                            id={`features-${service.id}`}
                                            key="features"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                                            className="overflow-hidden mt-3 space-y-2.5"
                                        >
                                            {service.features.map((feat, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05, duration: 0.22 }}
                                                    className="flex items-start gap-2.5"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <span className="text-[0.83rem] text-muted-foreground leading-snug">
                                                        {feat}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* ── CTA ── */}
                    <div className="mt-6">
                        {!isFeaturedVariant ? (
                            /* Full page: solid action button */
                            <Button
                                variant="outline"
                                className="w-full border-primary/20 group/cta
                                    hover:border-primary hover:bg-primary
                                    hover:text-primary-foreground transition-all duration-300"
                            >
                                Contact to Discuss
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/cta:translate-x-1
                                    transition-transform duration-200" />
                            </Button>
                        ) : (
                            /* Featured variant: subtle inline link */
                            <button
                                onClick={toggle}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold
                                    text-primary/60 hover:text-primary transition-colors duration-200
                                    focus-visible:outline-none focus-visible:ring-2
                                    focus-visible:ring-primary/50 rounded"
                            >
                                {expanded ? 'Show less' : 'Learn more'}
                                <motion.span
                                    animate={{ x: expanded ? 0 : [0, 3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                                >
                                    <ArrowRight className="w-3 h-3" />
                                </motion.span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

/* ── Services section ────────────────────────────────────────────────────── */
const Services = ({
    variant = 'full',
    featuredLimit = 3,
    ctaHref = '/services',
    ctaLabel = 'Explore all services',
    sectionId = 'services',
}: ServicesProps) => {
    const isFeaturedVariant = variant === 'featured';
    const { services, loading, error } = useServices(isFeaturedVariant);
    const displayServices = isFeaturedVariant ? services.slice(0, featuredLimit) : services;

    return (
        <section id={sectionId} className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">

            {/* Ambient background blobs — neutral gray, no color tint */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
                <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full
                    bg-neutral-300/20 dark:bg-neutral-700/20 blur-3xl opacity-60" />
                <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full
                    bg-neutral-200/20 dark:bg-neutral-800/20 blur-3xl opacity-60" />
            </div>

            <div className="container mx-auto px-4">

                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-14 px-4"
                >
                    {/* Eyebrow pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        border border-primary/20 bg-primary/5 text-primary
                        text-[0.7rem] font-bold uppercase tracking-[0.15em] mb-5">
                        <Sparkles className="w-3 h-3" />
                        {isFeaturedVariant ? 'Featured Services' : 'What I Offer'}
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                        {isFeaturedVariant ? 'Featured' : 'My'}{' '}
                        <span className="gradient-text">Services</span>
                    </h2>

                    <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary
                        mx-auto mb-5 rounded-full" />

                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl
                        mx-auto leading-relaxed">
                        {isFeaturedVariant
                            ? 'Specialized solutions crafted to bring your ideas to life.'
                            : 'Comprehensive technical and strategic services tailored for your unique needs.'}
                    </p>
                </motion.div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground text-sm tracking-wide">Loading services…</p>
                    </div>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <div className="text-center py-16 glassmorphism rounded-2xl max-w-md mx-auto">
                        <AlertCircle className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
                        <p className="text-muted-foreground">
                            Failed to load services. Please try again later.
                        </p>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && !error && displayServices.length === 0 && (
                    <div className="text-center py-16 glassmorphism rounded-2xl max-w-md mx-auto">
                        <BriefcaseBusiness className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">
                            {isFeaturedVariant ? 'No featured services' : 'No services available'}
                        </p>
                    </div>
                )}

                {/* ── Services grid ── */}
                {!loading && !error && displayServices.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                        gap-6 sm:gap-8 items-start">
                        {displayServices.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                index={index}
                                isFeaturedVariant={isFeaturedVariant}
                            />
                        ))}
                    </div>
                )}

                {/* ── Section-level CTA (featured variant only) ── */}
                {isFeaturedVariant && !loading && !error && displayServices.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.3 }}
                        className="flex justify-center mt-14 px-4"
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="glassmorphism flex items-center gap-2 w-full sm:w-auto max-w-sm
                                border-primary/20 hover:border-primary/50
                                hover:-translate-y-0.5 hover:shadow-lg
                                transition-all duration-300"
                            asChild
                        >
                            <Link to={ctaHref}>
                                {ctaLabel}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Services;
