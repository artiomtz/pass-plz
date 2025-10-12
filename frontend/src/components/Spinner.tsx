import { Disc3 } from 'lucide-react';

const Spinner: React.FC<{ size?: number; className?: string }> = ({ className, size = 18 }) => (
    <Disc3
        className={`animate-spin text-gray-500 ${className || ''}`}
        style={{ height: size, width: size }}
    />
);

export default Spinner;
