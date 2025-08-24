// components/PasswordHint.tsx

import { validatePassword } from '@utils/passwordUtil';

interface PasswordHintProps {
    password: string;
}

const PasswordHint: React.FC<PasswordHintProps> = ({ password }) => {
    const { checks } = validatePassword(password);

    const hintStyle = 'text-xs flex items-center gap-2';
    const passed = 'text-green-600';
    const failed = 'text-red-500';

    return (
        // <div className='m-3 space-y-1 text-gray-600 min-h-[5rem]'>
        <div className='absolute z-50 top-full left-0 mt-1 w-64 rounded-lg bg-gray-800 text-white text-sm p-4 shadow-xl'>
            <p className={hintStyle + ` ${checks.length ? passed : failed}`}>
                • At least 12 characters
            </p>
            <p className={hintStyle + ` ${checks.upper ? passed : failed}`}>
                • At least one uppercase letter
            </p>
            <p className={hintStyle + ` ${checks.lower ? passed : failed}`}>
                • At least one lowercase letter
            </p>
            <p className={hintStyle + ` ${checks.number ? passed : failed}`}>
                • At least one number
            </p>
            <p className={hintStyle + ` ${checks.symbol ? passed : failed}`}>
                • At least one symbol (e.g. @#$%)
            </p>
        </div>
    );
};

export default PasswordHint;
