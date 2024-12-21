"use client"
import React, { ReactNode, useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const LinkStashDialog: React.FC<DialogProps> & {
  Title: React.FC<{ children: ReactNode }>;
  Content: React.FC<{ children: ReactNode }>;
  Actions: React.FC<{ children: ReactNode }>;
} = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-50">
      <div ref={dialogRef} className="bg-white p-4 rounded-lg">
        {children}
      </div>
    </div>
  );
};

LinkStashDialog.Title = ({ children }) => (
  <h2 className="text-xl font-bold mb-4" style={{ color: 'hsl(305, 100%, 38%)' }}>
    {children}
  </h2>
);

LinkStashDialog.Content = ({ children }) => (
  <div className="mb-4">{children}</div>
);

LinkStashDialog.Actions = ({ children }) => (
  <div className="flex justify-end">{children}</div>
);

LinkStashDialog.Actions.displayName = "Action"
LinkStashDialog.Content.displayName = "Content"
LinkStashDialog.Title.displayName = "Title"

