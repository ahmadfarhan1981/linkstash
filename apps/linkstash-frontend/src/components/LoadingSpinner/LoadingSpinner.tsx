import React from "react";

export const LoadingSpinner = () => {
  const spinnerStyle = {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "3px solid rgba(0, 0, 0, 0.2)",
    borderTopColor: "#000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={spinnerStyle} className=""></div>
  );
};

