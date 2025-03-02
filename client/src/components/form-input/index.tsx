import { FC, ReactElement, ReactNode, memo } from 'react';

import clsx from 'clsx';

interface Props {
  label?: string;
  id: string;
  children: ReactNode;
  message?: string;
  prefix?: ReactElement;
}

const FormInput: FC<Props> = ({ children, message, label, id, prefix }) => {
  return (
    <div className="mb-2">
      {label && (
        <label htmlFor={id} className="text-xs mb-1">
          {label}
        </label>
      )}
      <div className={clsx('form-container', 'flex gap-2')}>
        {children}
        {prefix}
      </div>
      {typeof message === 'string' && (
        <span className="text-red-600 font-semibold mt-1 text-xs">{message || 'Required'}</span>
      )}
    </div>
  );
};

export default memo(FormInput);
