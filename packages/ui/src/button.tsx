import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ className = "", onClick }: ButtonProps) => {
  const nodeEnv = process.env.NODE_ENV;
  const libEnvName = process.env.VITE_LIB_ENV_NAME;

  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
      onClick={onClick}
    >
      <br />
      NODE_ENV: ({nodeEnv})
      <br />
      VITE_LIB_ENV_NAME: ({libEnvName})
      <br />
    </button>
  );
};
