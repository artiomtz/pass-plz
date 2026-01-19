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
                className='flex flex-wrap lg:ml-[160px] gap-2'
                key='tags'
                {...scaleMotionProps}>
                {safeTags.length > 0 &&
                    safeTags.map((tag) => (
                        <motion.span
                            className='text-xs px-2 py-0.5 rounded-full shadow-md cursor-pointer pill-style'
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
