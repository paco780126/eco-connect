import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="common-input-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
};
export default Input;