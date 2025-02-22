import { useEffect, useRef, useState } from 'react';

import { Html5Qrcode, Html5QrcodeCameraScanConfig, QrcodeSuccessCallback } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/header';

const Scan = () => {
  const refRender = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [text, setText] = useState<string>();

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('render');
    startScanner(html5QrCode);
    return () => {
      html5QrCode.stop();
    };
  }, []);

  useEffect(() => {
    if (text) {
      navigate(`/produk/${text}`, { replace: true });
    }
  }, [text]);

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

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Scanner" />
      <div className="flex-1 overflow-hidden" ref={refRender}>
        <div id="render" />
      </div>
    </div>
  );
};

export default Scan;
