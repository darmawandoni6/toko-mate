import { KeyboardEvent, useEffect, useState } from 'react';

import clsx from 'clsx';

import Header from '../../components/header';
import RemoveAlert from '../../components/remove-alert';
import { createKategori, listKategori, removeKategori, updateKategori } from '../../repository/kategori';
import { KategoriAPI, KategoriForm, KategoriList } from '../../repository/kategori/types';
import FormKategori from './form';

function Kategori() {
  const [kategori, setKategori] = useState<KategoriList>({ filter: [], list: [] });
  const [row, setRow] = useState<KategoriAPI>();
  const [show, setShow] = useState<boolean>(false);
  const [remove, setRemove] = useState<KategoriAPI>();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const res = await listKategori();
    setKategori({ list: res, filter: res });
  };

  const submitForm = async (data: KategoriForm) => {
    if (row) {
      await updateKategori(row.id, { nama: data.nama, status: data.status });
    } else {
      await createKategori({ nama: data.nama });
    }
    await fetch();
    setShow(false);
    setRow(undefined);
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    let text = e.currentTarget.value;
    if (text.length === 1) {
      setKategori(prev => ({ ...prev, filter: prev.list }));
    }
    if (e.key !== 'Enter') return;
    if (!text) {
      setKategori(prev => ({ ...prev, filter: prev.list }));
      return;
    }

    text = text.toLowerCase().trim();
    const res = kategori.list.filter(item => item.nama.toLocaleLowerCase().trim().includes(text));
    setKategori(prev => ({ ...prev, filter: res }));
  };

  const handleItem = (item?: KategoriAPI) => {
    setRow(item);
    setShow(!!item);
  };

  const handleRemove = async () => {
    if (!remove) {
      return;
    }
    await removeKategori(remove.id);
    await fetch();
  };

  return (
    <div className="flex flex-col gap-2">
      <Header title="Kategori" />

      <section className="h-12 border-b flex items-center px-2 gap-2">
        <div className="border flex-auto overflow-hidden h-8 rounded-full">
          <input
            type="text"
            inputMode="search"
            placeholder="Cari ...."
            className="w-full text-sm px-4 h-full outline-none"
            onKeyDown={handleSearch}
          />
        </div>
        <button className="h-8 aspect-square shrink-0" onClick={() => setShow(true)}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </section>
      <FormKategori show={show} setShow={() => setShow(false)} row={row} submit={submitForm} />
      <RemoveAlert show={!!remove} setShow={() => setRemove(undefined)} onSubmit={handleRemove} name={remove?.nama} />
      <section className="px-2">
        {kategori.filter.map((item, i) => (
          <div className="flex items-center justify-between p-2 border-b" key={i} onClick={() => handleItem(item)}>
            <span className="text-sm capitalize">{item.nama}</span>
            <div className="flex gap-2">
              <button
                className={clsx(
                  'border  py-1 px-2 text-xs  font-medium rounded-sm',
                  item.status ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600',
                )}
              >
                {item.status ? 'Active' : 'InActive'}
              </button>
              <button
                className="py-1 px-2 text-red-600"
                onClick={e => {
                  e.stopPropagation();
                  setRemove(item);
                }}
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Kategori;
