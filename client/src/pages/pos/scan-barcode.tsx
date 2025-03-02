import { FC, useEffect } from 'react';

import useBarcode from '../../hooks/use-barcode';

interface Props {
  open: boolean;
  onText: (text: string) => void;
}
const ScanBarcode: FC<Props> = ({ open, onText }) => {
  const { wrapper, text, onScanner } = useBarcode();
  useEffect(() => {
    if (open) {
      onScanner();
      return () => {
        onScanner();
      };
    }
  }, [open]);

  useEffect(() => {
    if (text) {
      onText(text);
      onScanner();
    }
  }, [text]);

  return (
    <>
      <h1 className="text-center py-2 font-bold text-base">Scan Barcode</h1>
      <div className="-mx-2 -mb-2 flex aspect-square">{wrapper}</div>
    </>
  );
};

export default ScanBarcode;
