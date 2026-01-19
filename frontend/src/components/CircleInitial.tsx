const CircleInitial: React.FC<{ initial: string }> = ({ initial }) => (
    <div
        className='flex items-center justify-center w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]
        font-bold rounded-full pill-style
        '>
        {initial}
    </div>
);

export default CircleInitial;
