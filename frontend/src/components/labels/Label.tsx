import React from 'react';

interface LabelProps {
    bold?: boolean;
    text: string;
}

const Label: React.FC<LabelProps> = ({ bold, text }) => {
    return <label className={bold ? 'font-bold' : ''}>{text}</label>;
};

export default Label;
