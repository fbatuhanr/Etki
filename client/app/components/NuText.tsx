import React from 'react';
import { Text, TextProps } from 'react-native';
import { FONTS } from '../constants/fonts';

interface NuTextProps extends TextProps {
    children: React.ReactNode;
    variant?: 'regular' | 'medium' | 'mediumItalic' | 'semiBold' | 'bold' | 'extraBold';
}

const NuText: React.FC<NuTextProps> = ({ children, variant = 'regular', style, ...rest }) => {

    const fontFamily = FONTS[variant];
    return (<Text style={[{ fontFamily }, style]} {...rest}>{children}</Text>);
};

export default NuText;
