import { createRoot } from 'react-dom/client';

import Wrapper from './Wrapper.tsx';
import './assets/styles/global.css';

createRoot(document.getElementById('root')!).render(<Wrapper />);
