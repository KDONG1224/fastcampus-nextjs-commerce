import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Carousel from 'nuka-carousel';

import { css } from '@emotion/react';
import { sampleImages } from 'pages/products';
import { CustomEditor } from 'components';
import { useRouter } from 'next/router';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';

const ProductsV2Edit = () => {
  const [index, setIndex] = useState(0);
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  );

  const router = useRouter();
  const { id: productId } = router.query;

  const handleSave = () => {
    if (editorState) {
      fetch(`/api/update-product`, {
        method: 'POST',
        body: JSON.stringify({
          id: productId,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          )
        })
      })
        .then((res) => res.json())
        .then(() => {
          alert('Success');
        });
    }
  };

  useEffect(() => {
    if (productId != null) {
      fetch(`/api/get-product?id=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.items.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.items.contents))
              )
            );
          } else {
            setEditorState(EditorState.createEmpty());
          }
        });
    }
  }, [productId]);

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
      {editorState != null && (
        <CustomEditor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default ProductsV2Edit;
