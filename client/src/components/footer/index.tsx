import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="sticky bottom-0 mx-auto mt-auto w-full">
      <div
        className="h-14 w-full bg-white flex gap-1"
        style={{
          boxShadow: '0px 0px 6px 0px #e5e7eb',
        }}
      >
        <button className="flex-auto flex flex-col gap-1 justify-center items-center" onClick={() => navigate('/')}>
          <i className="fa-solid fa-house"></i>
          <span className="text-xs">Home</span>
        </button>
        <div className="style flex-auto flex flex-col gap-1 justify-center items-center relative">
          <button
            className="h-14 aspect-square bg-white rounded-lg absolute -top-6 left-1/2 transform -translate-x-1/2 flex"
            style={{
              boxShadow: '0px 0px 6px 0px #e5e7eb',
            }}
            onClick={() => navigate('/scan')}
          >
            <i className="fa-solid fa-barcode m-auto text-3xl"></i>
          </button>
        </div>

        <button className="flex-auto flex flex-col gap-1 justify-center items-center" onClick={() => navigate('/pos')}>
          <i className="fa-solid fa-cart-shopping"></i> <span className="text-xs">Keranjang</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
