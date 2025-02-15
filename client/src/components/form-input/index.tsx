import { FC, ReactNode, memo } from 'react';

interface Props {
  label?: string;
  id: string;
  children: ReactNode;
  message?: string;
}

const FormInput: FC<Props> = ({ children, message, label, id }) => {
  return (
    <div className="form-container">
      {label && (
        <label htmlFor={id} className="text-xs mb-1">
          {label}
        </label>
      )}
      {children}
      {typeof message === 'string' && (
        <span className="text-red-600 font-semibold mt-1 text-xs">{message || 'Required'}</span>
      )}
    </div>
  );
};

export default memo(FormInput);
