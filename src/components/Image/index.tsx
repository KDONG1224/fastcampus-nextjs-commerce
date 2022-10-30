import styled from '@emotion/styled';
import Image from 'next/image';
import React from 'react';

export const AutoSizeImageWrapper = styled.div<{ size: number }>`
  width: ${(props) => (props.size ? `${props.size}px;` : '500px')};
  height: ${(props) => (props.size ? `${props.size}px;` : '500px')};
  position: relative;
`;

interface AutoSizeImageProps {
  src: string;
  size?: number;
}

export const AutoSizeImage: React.FC<AutoSizeImageProps> = ({
  src,
  size = 500
}) => {
  return (
    <AutoSizeImageWrapper size={size}>
      <Image src={src} alt="이미지" layout="fill" objectFit="contain" />
    </AutoSizeImageWrapper>
  );
};
