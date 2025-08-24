import { Disc3 } from 'lucide-react';

const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => {
    return <Disc3 className={`animate-spin text-gray-500`} style={{ width: size, height: size }} />;
};

export default Spinner;
