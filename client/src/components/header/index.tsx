import { FC, ReactElement } from 'react';

import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  children?: ReactElement;
}
const Header: FC<Props> = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 min-h-12 border flex items-center px-2 gap-2 bg-primary text-white z-10">
      <button className="absolute left-1 h-8 aspect-square" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <p className="flex-auto text-center">{title}</p>
      {children}
    </header>
  );
};

export default Header;
