import { FC } from 'react';

import { PropagateLoader } from 'react-spinners';

import Header from '../../components/header';

interface Props {
  loading: boolean;
}
const ProdukDetailEmpty: FC<Props> = ({ loading }) => {
  return (
    <>
      <Header title="Detail Produk" />
      <div className="flex-1 flex">
        {loading && (
          <div className="w-full flex justify-center h-6 my-6">
            <PropagateLoader color="var(--primary)" />
          </div>
        )}
        {!loading && (
          <div className="m-auto text-center">
            <i className="fa-solid fa-box-open text-7xl block mb-2"></i>
            <span className="text-xs">Empty Product</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ProdukDetailEmpty;
