import React from 'react';
import './App.css';

const App: React.FC = () => {
    const EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

    return <div className='card'>Hello {EMAIL}</div>;
};

export default App;
