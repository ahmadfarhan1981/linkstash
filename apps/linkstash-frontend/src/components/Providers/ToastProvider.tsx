'use client'
import React, {ReactNode, createContext, useContext, useState } from 'react';

import { ToastNotification } from '@/components/Default/ToastNotification/ToastNotification';

const ToastContext = createContext<ToastContextType >({} as ToastContextType);
export type ToastContextType = { addToast: (toast: Toast) => void };
export type Toast = { id?:number, summary:JSX.Element, details:JSX.Element, timeout?:number }

export const ToastProvider = ({ children }:{children: ReactNode}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Call this function to add a toast from anywhere.
  const addToast = ({ summary, details, timeout }:Toast) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, summary, details, timeout }
    ]);
  };

  const removeToast = (id:number) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
  {children}
  {/* Global container for toast notifications */}
  <div className="flex flex-col items-center space-y-2 top-14 fixed right-0 sm:right-[5%] md:right-[10%] lg:right-2 2xl:left-[calc(1258px+((100vw-1546px)/2))] w-24 sm:w-40 lg:w-72">
    {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
      summary={toast.summary}
      details={toast.details}
      timeout={toast.timeout}
      onClose={() => removeToast(toast.id!)}
  />
))}
  </div>
  </ToastContext.Provider>
);
};

export const useToast = () => useContext(ToastContext);
