"use client";

import { useState } from "react";


export type ConformActionButtonParams = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?:React.ReactNode,
  onClick?: ()=>void,
  className?: string,
}

export function ConfirmActionButton({children, onClick, className, ...props}: ConformActionButtonParams) {
  const [disabled, setDisabled] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleMouseEnter = () => {
    // Disable the button for a short period (e.g., 500ms) on hover
    setDisabled(true);
    setShowRipple(true);
    
    // Re-enable button after 500ms
    setTimeout(() => {
      setDisabled(false);
      setShowRipple(false);
    }, 500);
  };

  const handleMouseLeave = () => {    
    setDisabled(false);
    setShowRipple(false);    
  };

  return (
    <button
      {...props}
      className={`button 
                  alert-button 
                  ${className}
                  ${showRipple ? 'ripple-effect' : ''} 
                  overflow-hidden 
                  disabled:cursor-not-allowed`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
