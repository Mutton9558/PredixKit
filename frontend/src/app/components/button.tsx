import React from 'react'

type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
};

const button = ({ onClick, children, className = '' }: ButtonProps) => {
  return (
    <div>
      <button onClick={onClick} className={className}>
        {children}
      </button>
    </div>
  )
}

export default button