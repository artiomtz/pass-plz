import githubIcon from '@assets/githubIcon.png';
import LockIcon from '@assets/iconGray.svg';
import madeByIcon from '@assets/madeByIcon.png';
import React from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
};

export default function PageLayout({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className='flex flex-col min-h-screen'>
            <header className='flex items-center justify-center text-center h-[15vh] px-4 py-6 text-4xl font-bold text-[4vh] border-b'>
                {title}
            </header>

            <div className='flex flex-col flex-1 items-center justify-center sm:pt-[6vh] px-6 py-10'>
                <div className='w-full max-w-5xl items-center justify-center'>{children}</div>
            </div>

            {/* <div className='flex flex-col flex-1 items-center justify-center px-4 py-4'>
                <div className='w-full max-w-5xl'>{children}</div>
            </div> */}

            <footer className='flex h-[7vh] items-center justify-between border-t px-4 py-6 text-sm text-gray-500 w-full max-w-6xl mx-auto'>
                <a
                    href='https://github.com/your-username'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 hover:text-gray-800 transition'>
                    <img src={githubIcon} alt='My GitHub' className='w-20' />
                </a>
                <span className='flex items-center gap-2'>
                    <img className='w-7' src={LockIcon} alt='Pass Plz' />
                    Pass Plz © 2024
                </span>
                <a
                    href='https://artiomtsimk.in'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 hover:text-gray-800 transition'>
                    <img src={madeByIcon} alt='My Website' className='w-16' />
                </a>
            </footer>
            {/* <footer className='flex items-center justify-center h-[5vh] px-4 py-6 text-sm border-t text-gray-500'>
                <img className='m-2 w-7 h-7' src={LockIcon} alt='Icon' />
                Pass Plz © 2024
            </footer> */}
        </div>
    );
}
