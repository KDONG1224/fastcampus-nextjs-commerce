import { Slider } from '@mantine/core';
import { AutoSizeImage, CustomEditor } from 'components';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

const CommentEdit = () => {
  const router = useRouter();
  const { orderItemId } = router.query;

  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [rate, setRate] = useState<number>(5);
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  );

  const handleSave = () => {
    if (editorState) {
      fetch(`/api/update-comment`, {
        method: 'POST',
        body: JSON.stringify({
          orderItemId: Number(orderItemId),
          rate: rate,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
          images: images.join(',')
        })
      })
        .then((res) => res.json())
        .then(() => {
          alert('Success');
          router.back();
        });
    }
  };

  const handleUploadChange = () => {
    if (
      inputRef.current &&
      inputRef.current.files &&
      inputRef.current.files.length > 0
    ) {
      for (let i = 0; i < inputRef.current.files.length; i++) {
        const form = new FormData();

        form.append(
          'image',
          inputRef.current.files[i],
          inputRef.current.files[i].name
        );

        fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_DB}&expiration=15552000`,
          {
            method: 'POST',
            body: form
          }
        )
          .then((res) => res.json())
          .then((data) =>
            setImages((prev) =>
              Array.from(new Set(prev.concat(data.data.image.url)))
            )
          )
          .catch((err) => console.log(err));
      }
    }
  };

  useEffect(() => {
    if (orderItemId != null) {
      fetch(`/api/get-comment?orderItemId=${orderItemId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.items && data.items.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.items.contents))
              )
            );
            setRate(data.items.rate);
            setImages(data.items.images.split(',') ?? []);
          } else {
            setEditorState(EditorState.createEmpty());
          }
        });
    }
  }, [orderItemId]);

  return (
    <div>
      {editorState !== undefined && (
        <CustomEditor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
      <Slider
        defaultValue={5}
        min={1}
        max={5}
        step={1}
        value={rate}
        onChange={setRate}
        marks={[
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 }
        ]}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUploadChange}
      />
      <div style={{ display: 'flex' }}>
        {images &&
          images.length > 0 &&
          images.map((img, idx) => <AutoSizeImage key={idx} src={img} />)}
      </div>
    </div>
  );
};

export default CommentEdit;
