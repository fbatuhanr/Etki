import React from 'react';
import { Link, LinkProps } from 'expo-router';
import { FONTS } from '../constants/fonts';

interface NuTextProps extends LinkProps {
    children: React.ReactNode;
    variant?: 'regular' | 'medium' | 'mediumItalic' | 'semiBold' | 'bold' | 'extraBold';
}

const NuText: React.FC<NuTextProps> = ({ children, variant = 'regular', style, ...rest }) => {

    const fontFamily = FONTS[variant];
    return (<Link style={[{ fontFamily }, style]} {...rest}>{children}</Link>);
};

export default NuText;
