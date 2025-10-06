import githubIcon from '@assets/githubIcon.png';
import LockIcon from '@assets/iconGray.svg';
import madeByIcon from '@assets/madeByIcon.png';
import LabelLastVisited from '@components/labels/LabelLastVisited';
import Navbar from '@components/Navbar';
import React from 'react';

type GlobalLayoutProps = {
    title: string;
    children: React.ReactNode;
};

const GlobalLayout = ({ children, title }: GlobalLayoutProps) => {
    return (
        <div className='flex flex-col min-h-screen'>
            <header className='relative flex items-center justify-center text-center h-[14vh] sm:h-[12vh] px-4 py-6 font-bold border-b'>
                <div
                    className={`pb-2 sm:pb-0 break-words ${
                        title.length > 30 ? 'text-xl sm:text-4xl' : 'text-4xl sm:text-[2.5rem]'
                    }`}>
                    {title}
                </div>
                <Navbar />
                <LabelLastVisited />
            </header>

            <div className='flex flex-col flex-1 items-center justify-center sm:pt-8 px-6 py-10'>
                <div className='w-full max-w-5xl items-center justify-center'>{children}</div>
            </div>

            <footer className='flex h-[7vh] items-center justify-between border-t px-4 py-6 text-sm text-gray-500 w-full max-w-6xl mx-auto'>
                <a
                    className='flex items-center gap-2 hover:text-gray-800 transition'
                    href='https://github.com/artiomtz/pass-plz'
                    rel='noopener noreferrer'
                    target='_blank'>
                    <img
                        alt='My GitHub'
                        className='w-20'
                        src={githubIcon}
                    />
                </a>
                <span className='flex items-center gap-2'>
                    <img
                        alt='Pass Plz'
                        className='w-7'
                        src={LockIcon}
                    />
                    Pass Plz © 2024
                </span>
                <a
                    className='flex items-center gap-2 hover:text-gray-800 transition'
                    href='https://artiomtsimk.in'
                    rel='noopener noreferrer'
                    target='_blank'>
                    <img
                        alt='My Website'
                        className='w-16'
                        src={madeByIcon}
                    />
                </a>
            </footer>
        </div>
    );
};

export default GlobalLayout;
