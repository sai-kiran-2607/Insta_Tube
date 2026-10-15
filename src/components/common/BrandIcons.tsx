import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';

interface BrandIconProps {
  size?: number;
  color?: string;
}

export const InstagramIcon: React.FC<BrandIconProps> = ({
  size = 24,
  color = colors.instagramPink,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5.5"
        stroke={color}
        strokeWidth="2"
      />
      <Circle cx="12" cy="12" r="4.2" stroke={color} strokeWidth="2" />
      <Circle cx="17.5" cy="6.5" r="1.3" fill={color} />
    </Svg>
  );
};

