import { scaleMotionProps } from '@utils/motionUtil';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface TagsProps {
    onRemove: (_tag: string) => void;
    tags: string[];
}

const Tags: React.FC<TagsProps> = ({ onRemove, tags }) => {
    const safeTags = Array.isArray(tags) ? tags : [];

    return (
        <AnimatePresence>
            <motion.div
                className='flex gap-2 flex-wrap lg:ml-[160px]'
                key='tags'
                {...scaleMotionProps}>
                {safeTags.length > 0 &&
                    safeTags.map((tag) => (
                        <motion.span
                            className='px-2 py-0.5 rounded-full text-xs cursor-pointer shadow-md pill-style'
                            key={'tag-' + tag}
                            onClick={() => onRemove(tag)}
                            title='Delete'
                            {...scaleMotionProps}>
                            {tag}
                        </motion.span>
                    ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default Tags;
