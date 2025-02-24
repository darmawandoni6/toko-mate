import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../components/header';
import RemoveAlert from '../../components/remove-alert';
import ReactSwitch from '../../components/switch';
import { config } from '../../config/base';
import { AllListDiskon } from '../../repository/diskon';
import { DiskonAPI } from '../../repository/diskon/types';
import { listKategori } from '../../repository/kategori';
import { KategoriAPI } from '../../repository/kategori/types';
import { detailProduk, removeProduk, updateProduk, updateStatus, uploadFile } from '../../repository/produk';
import { ProdukAPI, ProdukForm, ProdukPayload } from '../../repository/produk/types';
import { currency, toNumber } from '../../utils/number';
import List from './_components/list';
import ProdukDetailEmpty from './detail-empty';
import FormProduk from './form-produk';
import { calculationDiskon } from './utils';

const ProdukDetail = () => {
  const param = useParams();
  const navigate = useNavigate();

  const [kategori, setKategori] = useState<KategoriAPI[]>([]);
  const [diskon, setDiskon] = useState<DiskonAPI[]>([]);
  const [row, setRow] = useState<ProdukAPI | null>(null);
  const [show, setShow] = useState<{ form: boolean; remove: boolean }>({ form: false, remove: false });
  const [loading, setLoading] = useState<{
    fetch: boolean;
    status: boolean;
  }>({
    fetch: false,
    status: false,
  });

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

  useEffect(() => {
    if (row) {
      Promise.all([fetchAll()]);
    }
  }, [row]);

  const fetchAll = async () => {
    const [k, d] = await Promise.allSettled([listKategori(), AllListDiskon()]);
    setKategori(k.status === 'fulfilled' ? k.value : []);
    setDiskon(d.status === 'fulfilled' ? d.value : []);
  };

  const fetchProduk = async (id: string) => {
    try {
      setLoading(prev => ({ ...prev, fetch: true }));
      const res = await detailProduk(id);
      if (res && res.image) {
        res.image = config.baseUrl + '/' + res.image;
      }
      setRow(res);
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  if (!row) return <ProdukDetailEmpty loading={loading.fetch} />;

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
    setShow(prev => ({ ...prev, form: !prev.form }));
  };
  const onRemove = () => {
    setShow(prev => ({ ...prev, remove: !prev.remove }));
  };

  const onStatus = async (val: boolean) => {
    if (loading.status) return;
    try {
      setLoading(prev => ({ ...prev, status: true }));
      await updateStatus(row.id, val);
      await fetchProduk(row.id);
      setRow(prev => prev && { ...prev, status: val });
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const prevImage = row.image ?? '';

    const frm = new FormData();
    frm.append('produk', e.target.files[0]);
    frm.append('prev_image', prevImage.replace(config.baseUrl + '/', ''));
    const url = URL.createObjectURL(e.target.files[0])!;
    setRow(prev => (prev ? { ...prev, image: url } : null));

    const error = await uploadFile(row!.id, frm);
    await fetchProduk(row.id);
    if (error) {
      setRow(prev => (prev ? { ...prev, image: prevImage } : null));
    }
  };

  const removeItem = async () => {
    await removeProduk(row.id);
    navigate(-1);
  };

  return (
    <>
      <Header title="Detail Produk">
        <section className="absolute right-1 h-8 flex gap-1">
          <button className=" aspect-square" onClick={onForm}>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button className="aspect-square" onClick={onRemove}>
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </section>
      </Header>

      <FormProduk
        show={show.form}
        setShow={onForm}
        kategori={kategori}
        diskon={diskon}
        setSubmit={onSubmit}
        row={row}
      />
      <RemoveAlert show={show.remove} onSubmit={removeItem} setShow={onRemove} name={row.nama} />

      <div className="p-3">
        <section>
          <List label="Barcode" value={row.barcode} />
          <List label="Barcode" value={row.nama} />
          <div className="flex items-center border-b p-2">
            <label htmlFor="file" className="h-36 aspect-square flex bg-gray-300 rounded-lg">
              {row.image ? (
                <img src={row.image} alt={row.nama} width={144} height={144} className="aspect-square object-cover" />
              ) : (
                <i className="fa-regular fa-image m-auto text-5 xl"></i>
              )}
            </label>
            <input className="hidden" id="file" type="file" onChange={onFile} />
          </div>
          <List label="Kategori" value={row.kategori.nama} />
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
