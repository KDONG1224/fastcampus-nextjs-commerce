import { SnsLogin } from 'components';
import React from 'react';

const Login = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '70vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <SnsLogin />
    </div>
  );
};

export default Login;
