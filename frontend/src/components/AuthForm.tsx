import { useState } from 'react';

interface AuthFormProps {
    buttonText: string;
    onSubmit: (_email: string, _password: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ buttonText, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(email, password);
            }}>
            <input
                onChange={(e) => {
                    return setEmail(e.target.value);
                }}
                placeholder='Email'
                required
                type='email'
                value={email}
            />
            <input
                onChange={(e) => {
                    return setPassword(e.target.value);
                }}
                placeholder='Password'
                required
                type='password'
                value={password}
            />
            <button type='submit'>{buttonText}</button>
        </form>
    );
};

export default AuthForm;
