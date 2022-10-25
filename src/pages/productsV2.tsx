import React, { useState } from 'react';
import Image from 'next/image';
import Carousel from 'nuka-carousel';

import { css } from '@emotion/react';
import { sampleImages } from './products/[id]';

const ProductsV2 = () => {
  const [index, setIndex] = useState(0);
  return (
    <>
      <Carousel
        animation="fade"
        autoplay
        withoutControls
        wrapAround
        speed={10}
        slideIndex={index}
      >
        {sampleImages.map((image) => (
          <Image
            key={image.original}
            src={image.original}
            alt={image.thumbnail}
            width={1000}
            height={600}
            layout="responsive"
          />
        ))}
      </Carousel>
      <div
        css={css`
          display: flex;
        `}
      >
        {sampleImages.map((item, idx) => (
          <div key={idx} onClick={() => setIndex(idx)}>
            <Image src={item.original} alt="image" width={100} height={60} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsV2;
