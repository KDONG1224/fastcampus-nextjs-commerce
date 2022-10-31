import React from 'react';
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider
} from '@react-oauth/google';
import { CLIENT_ID } from 'pages/_app';

const GoogleAuthLogin = () => {
  const handleGoogle = (res: CredentialResponse) => {
    fetch(`/api/auth/sign-up?credential=${res.credential}`)
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{ display: 'flex' }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handleGoogle(credentialResponse);
          }}
          onError={() => {
            alert('Login Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthLogin;
