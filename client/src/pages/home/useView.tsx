import Skeleton from '../../components/skeleton';
import { InitialState } from '../../utils/provider/types';

export const useView = ({ data, loading }: InitialState['profile']) => {
  if (loading) {
    return (
      <>
        <Skeleton className="mb-1" style={{ width: 120, height: 22 }} />
        <Skeleton style={{ width: 100, height: 12 }} />
      </>
    );
  }
  return (
    <>
      <span className="block text-base font-bold">{data?.nama || '-'}</span>
      <span className="text-xs leading-none">{data?.toko.hp || '-'}</span>
    </>
  );
};
