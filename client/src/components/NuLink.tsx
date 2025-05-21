import React from 'react';
import { Link, LinkProps } from 'expo-router';
import { FONTS } from '@/src/constants/fonts';

interface NuLinkProps extends LinkProps {
    children: React.ReactNode;
    variant?: 'regular' | 'medium' | 'mediumItalic' | 'semiBold' | 'bold' | 'extraBold';
}

const NuLink: React.FC<NuLinkProps> = ({ children, variant = 'regular', style, ...rest }) => {

    const fontFamily = FONTS[variant];
    return (<Link style={[{ fontFamily }, style]} {...rest}>{children}</Link>);
};

export default NuLink;
