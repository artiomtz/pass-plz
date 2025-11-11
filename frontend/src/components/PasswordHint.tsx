import { validatePassword } from '@utils/passwordUtil';
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react';

interface PasswordHintProps {
    password: string;
}

const PasswordHint: React.FC<PasswordHintProps> = ({ password }) => {
    const { checks } = validatePassword(password);
    const hintStyle = 'flex items-center gap-2';

    return (
        <div className='absolute z-10 top-full left-0 mt-1 w-70 rounded-xl text-sm p-4 shadow-xl card-style'>
            <p className={hintStyle + ` ${checks.length ? 'check-pass-style' : 'check-fail-style'}`}>
                {checks.length ? <LockKeyhole size={18} /> : <LockKeyholeOpen size={18} />} At least 12 characters
            </p>
            <p className={hintStyle + ` ${checks.upper ? 'check-pass-style' : 'check-fail-style'}`}>
                {checks.upper ? <LockKeyhole size={18} /> : <LockKeyholeOpen size={18} />} At least one uppercase letter
            </p>
            <p className={hintStyle + ` ${checks.lower ? 'check-pass-style' : 'check-fail-style'}`}>
                {checks.lower ? <LockKeyhole size={18} /> : <LockKeyholeOpen size={18} />} At least one lowercase letter
            </p>
            <p className={hintStyle + ` ${checks.number ? 'check-pass-style' : 'check-fail-style'}`}>
                {checks.number ? <LockKeyhole size={18} /> : <LockKeyholeOpen size={18} />} At least one number
            </p>
            <p className={hintStyle + ` ${checks.symbol ? 'check-pass-style' : 'check-fail-style'}`}>
                {checks.symbol ? <LockKeyhole size={18} /> : <LockKeyholeOpen size={18} />} At least one symbol (e.g.
                @#$%)
            </p>
        </div>
    );
};

export default PasswordHint;
