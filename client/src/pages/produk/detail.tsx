import { useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import Header from '../../components/header';
import ReactSwitch from '../../components/switch';
import { AllListDiskon } from '../../repository/diskon';
import { DiskonAPI } from '../../repository/diskon/types';
import { listKategori } from '../../repository/kategori';
import { KategoriAPI } from '../../repository/kategori/types';
import { detailProduk, updateProduk, updateStatus } from '../../repository/produk';
import { ProdukAPI, ProdukForm, ProdukPayload } from '../../repository/produk/types';
import { currency, toNumber } from '../../utils/number';
import List from './_components/list';
import FormProduk from './form-produk';
import { calculationDiskon } from './utils';

const ProdukDetail = () => {
  const param = useParams();

  const [kategori, setKategori] = useState<KategoriAPI[]>([]);
  const [diskon, setDiskon] = useState<DiskonAPI[]>([]);
  const [row, setRow] = useState<ProdukAPI | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateDiskon = useMemo(() => {
    if (row) {
      const harga = calculationDiskon(row);
      return harga;
    }
    return 0;
  }, [row]);

  useEffect(() => {
    if (param.id) {
      fetchProduk(param.id);
    }
  }, []);

  const fetchProduk = async (id: string) => {
    const k = await listKategori();
    setKategori(k);
    const res = await detailProduk(id);
    setRow(res);
    const d = await AllListDiskon();
    setDiskon(d);
  };

  if (!row) return null;

  const onSubmit = async (data: ProdukForm) => {
    const payload: ProdukPayload = {
      barcode: data.barcode,
      nama: data.nama,
      harga_beli: toNumber(data.harga_beli),
      harga_jual: toNumber(data.harga_jual),
      total_stok: toNumber(data.total_stok),
      kategori_id: data.kategori.value,
      diskon_id: data.diskon?.value,
    };
    await updateProduk(row.id, payload);

    await fetchProduk(row.id);
  };

  const onForm = () => {
    setShow(prev => !prev);
  };

  const onStatus = async (val: boolean) => {
    if (loading) return;
    try {
      setLoading(true);
      await updateStatus(row.id, val);
      await fetchProduk(row.id);
      setRow(prev => prev && { ...prev, status: val });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Detail Produk">
        <button className="absolute right-1 h-8 aspect-square" onClick={() => setShow(true)}>
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
      </Header>
      <FormProduk show={show} setShow={onForm} kategori={kategori} diskon={diskon} setSubmit={onSubmit} row={row} />

      <div className="p-3">
        <section>
          <List label="Barcode" value={row.barcode} />
          <List label="Barcode" value={row.nama} />
          <div className="flex items-center border-b p-2">
            <div className="h-36 aspect-square flex bg-gray-300 rounded-lg">
              <i className="fa-regular fa-image m-auto text-5 xl"></i>
            </div>
          </div>
          <List label="Kategori" className="capitalize" value={row.kategori.nama} />
          <List label="Harga Beli" value={currency(row.harga_beli)} />
          <List label="Harga Jual" value={currency(row.harga_jual)} />
          <List label="Harga Diskon" value={currency(row.harga_jual - calculateDiskon)} />
          <List label="Stok" value={row.total_stok.toLocaleString('id-ID')} />
          <List
            label="Status"
            status={
              <ReactSwitch
                checked={row.status}
                height={20}
                width={40}
                onChange={val => {
                  onStatus(val);
                }}
              />
            }
          />
        </section>
      </div>
    </>
  );
};

export default ProdukDetail;
