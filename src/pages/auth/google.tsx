import { css } from '@emotion/react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React from 'react';

const GoogleAuthLogin = () => {
  const handleGoogle = (res: CredentialResponse) => {
    fetch(`/api/auth/sign-in?credential=${res.credential}`)
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogle(credentialResponse);
        }}
        onError={() => {
          alert('Login Failed');
        }}
      />
    </div>
  );
};

export default GoogleAuthLogin;
