import { useState } from 'react';

import Footer from '../../components/footer';
import { getProfile, updateProfile } from '../../repository/auth';
import { ProfilePayload } from '../../repository/auth/types';
import { useDispatch, useGetValue } from '../../utils/provider';
import FormProfile from './form-profile';

function Profil() {
  const profile = useGetValue(state => state.profile.data);
  const dispatch = useDispatch();

  const [show, setShow] = useState<boolean>(false);

  if (!profile) return;

  const onSubmit = async (payload: ProfilePayload) => {
    await updateProfile(payload);

    dispatch(getProfile());
  };

  return (
    <>
      <div className="relative">
        <FormProfile show={show} setShow={() => setShow(false)} data={profile} submit={onSubmit} />
        <button className="border absolute right-3 top-3" onClick={() => setShow(true)}>
          <i className="fa-solid fa-pen"></i>
        </button>
        <div className="flex flex-col justify-end items-center h-60 bg-gray-200 py-4 gap-3 text-gray-600">
          <div className="h-1/3 aspect-square text-center text-7xl">
            <i className="fa-solid fa-circle-user"></i>
          </div>
          <div className="text-center text-xs">
            <p className="font-bold">{profile.nama || '-'}</p>
            <p>{`~ ${profile.email} ~`}</p>
          </div>
        </div>
        <div className="p-2">
          <div className="border-b py-2 px-3">
            <p className="text-sm font-semibold mb-1">Nama Toko</p>
            <p className="text-xs">{profile.toko.nama}</p>
          </div>
          <div className="border-b py-2 px-3">
            <p className="text-sm font-semibold mb-1">Alamat</p>
            <p className="text-xs">{profile.toko.alamat}</p>
          </div>
          <div className="border-b py-2 px-3">
            <p className="text-sm font-semibold mb-1">No. Telp</p>
            <p className="text-xs">{profile.toko.hp}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profil;
