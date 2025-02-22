import { CSSProperties, FC } from 'react';

import clsx from 'clsx';

interface Props {
  className?: string;
  style?: CSSProperties;
}

const Skeleton: FC<Props> = ({ style, className }) => {
  return (
    <div role="status" className="max-w-sm animate-pulse">
      <div className={clsx('bg-gray-200 rounded-full dark:bg-gray-700', className)} style={style} />
    </div>
  );
};

export default Skeleton;
