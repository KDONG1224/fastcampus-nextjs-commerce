import { SnsLogin } from 'components';
import React from 'react';

const Login = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <SnsLogin />
    </div>
  );
};

export default Login;
