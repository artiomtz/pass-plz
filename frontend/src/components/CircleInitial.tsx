const CircleInitial: React.FC<{ initial: string }> = ({ initial }) => (
    <div className='w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700'>
        {initial}
    </div>
);

export default CircleInitial;
