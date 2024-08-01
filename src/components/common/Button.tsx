import React, { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        `w-full py-[15px] px-7 rounded-[10px] font-bold text-body-regular z-90 hover:opacity-90 min-h-[56px] btn-${variant}`,
        className ? className : '',
        disabled || loading ? 'btn-disabled' : ''
      )}
      disabled={disabled || loading}
    >
      {loading ? <Loader /> : children}
    </button>
  );
};

const Loader = () => (
  <div className="flex items-center justify-center">
    <div className="btn-loader"></div>
  </div>
);

export default Button;
