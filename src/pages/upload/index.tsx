import styled from '@emotion/styled';
import { Button } from 'components';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

const AutoSizeImageWrapper = styled.div`
  width: 500px;
  height: 500px;
  position: relative;
`;

const ImageUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState('');

  const handleUpload = () => {
    if (inputRef.current && inputRef.current.files) {
      const form = new FormData();

      form.append(
        'image',
        inputRef.current.files[0],
        inputRef.current.files[0].name
      );

      fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_DB}&expiration=15552000`,
        {
          method: 'POST',
          body: form
        }
      )
        .then((res) => res.json())
        .then((data) => setImage(data.data.image.url))
        .catch((err) => console.log(err));
    }
  };
  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" />
      <Button onClick={handleUpload}>업로드</Button>
      {image !== '' && (
        <AutoSizeImageWrapper>
          <Image src={image} alt="이미지" layout="fill" objectFit="contain" />
        </AutoSizeImageWrapper>
      )}
    </div>
  );
};

export default ImageUpload;
