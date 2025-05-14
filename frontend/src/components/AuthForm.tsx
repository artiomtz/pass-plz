import { useState } from 'react';

interface AuthFormProps {
    onSubmit: (email: string, password: string) => void;
    buttonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, buttonText }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(email, password);
            }}>
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type='submit'>{buttonText}</button>
        </form>
    );
};

export default AuthForm;
