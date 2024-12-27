import React from 'react';
import { Box } from '@chakra-ui/react';
import { CSSProperties } from 'react';

interface KKiapayCheckoutProps {
  amount: string;
  key: string;
  callback: (response: any) => void;
  style?: CSSProperties;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    KKiapayWidget: any;
  }
}

export const KKiapayCheckout: React.FC<KKiapayCheckoutProps> = ({
  amount,
  key,
  callback,
  style,
  children,
}) => {
  const defaultStyle: CSSProperties = {
    backgroundColor: "#4299E1",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    ...style
  };

  const handleClick = () => {
    if (window.KKiapayWidget) {
      window.KKiapayWidget.init({
        amount: amount,
        key: key,
        callback: callback,
        position: "center",
        sandbox: "true",
        data: "",
        theme: "light"
      });
    }
  };

  return (
    <Box width="full">
      <button onClick={handleClick} style={defaultStyle}>
        {children}
      </button>
    </Box>
  );
};
