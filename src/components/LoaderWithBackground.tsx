import React from 'react';
import { PuffLoader } from 'react-spinners';

interface LoaderWithBackgroundProps {
  visible: boolean;
}

const LoaderWithBackground: React.FC<LoaderWithBackgroundProps> = ({ visible}) => {
  if (!visible) return null;

  return (
    <div style={overlayStyle}>
      <PuffLoader
        color="#7B3FFF"
        size={80}
        aria-label="puff-loading"
        cssOverride={{}}
      />
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

export default LoaderWithBackground;
