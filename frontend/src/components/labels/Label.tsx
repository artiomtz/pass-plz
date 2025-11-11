import React from 'react';

interface LabelProps {
    bold?: boolean;
    text: string;
}

const Label: React.FC<LabelProps> = ({ bold, text }) => <label className={bold ? 'bold-style' : ''}>{text}</label>;

export default Label;
