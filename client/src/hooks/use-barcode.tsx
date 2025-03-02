import { useEffect, useRef, useState } from 'react';

import { Html5Qrcode, Html5QrcodeCameraScanConfig, QrcodeSuccessCallback } from 'html5-qrcode';

const useBarcode = () => {
  const refRender = useRef<HTMLDivElement | null>(null);

  const [text, setText] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      const html5QrCode = new Html5Qrcode('render');
      startScanner(html5QrCode);
      return () => {
        html5QrCode.stop();
      };
    }
  }, [open]);

  useEffect(() => {
    if (text) {
      onScanner();
    }
  }, [text]);

  const onScanner = () => {
    setOpen(prev => !prev);
  };

  const startScanner = (scanner: Html5Qrcode) => {
    const qrCodeSuccessCallback: QrcodeSuccessCallback = decodedText => {
      setText(decodedText);
      scanner.clear();
    };

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: 300,
      videoConstraints: {
        height: refRender.current?.clientHeight || 250,
        width: refRender.current?.clientWidth || 250,
        aspectRatio: 1,
      },
    };

    // If you want to prefer front camera
    // html5QrCode.start({ facingMode: { exact: 'user' } }, config, );
    scanner.start({ facingMode: 'user' }, config, qrCodeSuccessCallback, undefined);
  };

  return {
    text,
    wrapper: (
      <div className="flex-1 overflow-hidden" ref={refRender}>
        <div id="render" />
      </div>
    ),
    onScanner,
    openScan: open,
  };
};

export default useBarcode;
