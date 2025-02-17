import { lazy } from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import App from './App.tsx';
import './assets/styles/global.css';
import ContextData from './utils/provider/ContextData.tsx';

const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));

createRoot(document.getElementById('root')!).render(
  <main className="h-dvh w-[480px] max-w-full mx-auto flex flex-col">
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route
          element={
            <ContextData>
              <App />
            </ContextData>
          }
          path="*"
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </main>,
);
