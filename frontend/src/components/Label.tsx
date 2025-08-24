import React from 'react';

interface LabelProps {
    text: string;
    bold?: boolean;
}

const Label: React.FC<LabelProps> = ({ text, bold }) => {
    return <label className={bold ? 'font-bold' : ''}>{text}</label>;
};

export default Label;
