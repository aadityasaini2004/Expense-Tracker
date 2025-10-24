// src/components/Loader.js
import React from 'react';
import { BarLoader } from 'react-spinners';

const Loader = () => {
  const override = {
    display: 'block',
    margin: '0 auto',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }}>
      <BarLoader color={"#4A90E2"} cssOverride={override} width={200} />
    </div>
  );
};

export default Loader;
