import { FC, ReactNode } from 'react';

import clsx from 'clsx';

interface Props {
  label: string;
  value?: string;
  status?: ReactNode;
  className?: string;
}
const List: FC<Props> = props => {
  return (
    <div className="relative flex items-center border-b p-2">
      <span className="text-red-600 italic text-sm basis-1/2">{props.label}</span>
      {!props.status && <span className={clsx('font-semibold flex-1', props.className)}>{props.value || '-'}</span>}
      {props.status && <div className={props.className}>{props.status}</div>}
    </div>
  );
};

export default List;
