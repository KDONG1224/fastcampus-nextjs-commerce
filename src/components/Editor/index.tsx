import styled from '@emotion/styled';
import { Button } from 'components/Button';
import dynamic from 'next/dynamic';
import React, { Dispatch, SetStateAction } from 'react';
import { EditorProps, EditorState } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  { ssr: false }
);

const StyledWrapper = styled.div<{ readOnly: boolean; noPadding: boolean }>`
  padding: 16px;
  ${(props) =>
    props.readOnly ? '' : 'border: 1px solid black; border-radius: 8px;'}
  ${(props) => (props.noPadding ? '' : 'padding: 16px;')}
`;

interface CustomEditorProps {
  editorState: EditorState;
  readOnly?: boolean;
  noPadding?: boolean;
  onSave?: () => void;
  onEditorStateChange?: Dispatch<SetStateAction<EditorState | undefined>>;
}

export const CustomEditor: React.FC<CustomEditorProps> = ({
  editorState,
  readOnly = false,
  noPadding = false,
  onSave,
  onEditorStateChange
}) => {
  return (
    <StyledWrapper readOnly={readOnly} noPadding={noPadding}>
      <Editor
        readOnly={readOnly}
        editorState={editorState}
        toolbarHidden={readOnly}
        toolbarClassName="editorToolbar-hidden"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ['inline', 'list', 'textAlign', 'link']
        }}
        localization={{
          locale: 'ko'
        }}
      />
      {!readOnly && <Button onClick={onSave}>Save</Button>}
    </StyledWrapper>
  );
};
