import { FC, useEffect } from 'react';

import { Html5Qrcode, Html5QrcodeCameraScanConfig, QrcodeSuccessCallback } from 'html5-qrcode';

interface Props {
  open: boolean;
  onText: (text: string) => void;
}
const ScanBarcode: FC<Props> = ({ open, onText }) => {
  useEffect(() => {
    if (open) {
      const html5QrCode = new Html5Qrcode('render');

      startScanner(html5QrCode);
      return () => {
        html5QrCode.stop();
      };
    }
  }, [open]);

  const startScanner = (scanner: Html5Qrcode) => {
    const qrCodeSuccessCallback: QrcodeSuccessCallback = decodedText => {
      onText(decodedText);
      scanner.clear();
    };

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: 250,
    };

    // If you want to prefer front camera
    // html5QrCode.start({ facingMode: { exact: 'user' } }, config, );

    scanner.start({ facingMode: 'user' }, config, qrCodeSuccessCallback, undefined);
  };

  return (
    <>
      <h1 className="text-center py-2 font-bold text-base">Scan Barcode</h1>

      <div className="-mx-2 -mb-2">
        <div id="render" />
      </div>
    </>
  );
};

export default ScanBarcode;
