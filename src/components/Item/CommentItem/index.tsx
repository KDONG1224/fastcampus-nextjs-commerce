import styled from '@emotion/styled';
import { IconStar } from '@tabler/icons';
import { CustomEditor } from 'components/Editor';
import { AutoSizeImage } from 'components/Image';
import { format } from 'date-fns';
import { convertFromRaw, EditorState } from 'draft-js';

import { CommentItemType } from 'pages/products/[id]';
import React from 'react';

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px;
`;

interface CommnetItemProps {
  comment: CommentItemType;
}

export const CommnetItem: React.FC<CommnetItemProps> = ({ comment }) => {
  const { rate, contents, price, quantity, amount, updatedAt, images } =
    comment;

  return (
    <Wrapper>
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <IconStar
                  key={idx}
                  fill={idx < rate ? 'red' : 'none'}
                  stroke={idx < rate ? 0 : 1}
                />
              ))}
            </div>
            <span className="text-zinc-300 text-xs">
              {price.toLocaleString('ko-kr')}원 * {quantity} 개 ={' '}
              {amount.toLocaleString('ko-kr')}원
            </span>
          </div>
          <p className="text-zinc-500 ml-auto">
            {format(new Date(updatedAt), 'yyyy년 M월 d일')}
          </p>
        </div>
        <CustomEditor
          editorState={EditorState.createWithContent(
            convertFromRaw(JSON.parse(contents ?? ''))
          )}
          readOnly
          noPadding
        />
      </div>
      <div className="flex">
        {images &&
          images.length > 0 &&
          images
            .split(',')
            .map((img, idx) => (
              <AutoSizeImage key={idx} src={img} size={150} />
            ))}
      </div>
    </Wrapper>
  );
};
