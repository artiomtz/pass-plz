const CircleInitial: React.FC<{ initial: string }> = ({ initial }) => (
    <div
        className='w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full
            flex items-center justify-center font-bold pill-style
        '>
        {initial}
    </div>
);

export default CircleInitial;
