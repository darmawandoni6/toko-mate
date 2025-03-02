import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import Header from '../../components/header';
import useBarcode from '../../hooks/use-barcode';

const Scan = () => {
  const navigate = useNavigate();
  const { wrapper, onScanner, text } = useBarcode();

  useEffect(() => {
    onScanner();
    return () => {
      onScanner();
    };
  }, []);

  useEffect(() => {
    if (text) {
      navigate(`/produk/${text}`, { replace: true });
    }
  }, [text]);

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Scanner" />
      {wrapper}
    </div>
  );
};

export default Scan;
