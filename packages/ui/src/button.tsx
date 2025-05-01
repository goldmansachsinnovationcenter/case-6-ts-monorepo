import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ 
  children, 
  className = '', 
  onClick 
}: ButtonProps) => {
  const env = process.env.NODE_ENV || 'development';
  
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
      onClick={onClick}
    >
      {children} ({env})
    </button>
  );
};
