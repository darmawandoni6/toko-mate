import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { PropagateLoader } from 'react-spinners';

import ScrollElement from '../../components/scroll-element';
import { createDiskon, listDiskon, removeDiskon, updateDiskon } from '../../repository/diskon';
import { DiskonAPI, DiskonPayload } from '../../repository/diskon/types';
import { dateValue } from '../../utils/date';
import FormDiskon from './form';
import { DiskonView } from './types';

let time: number;
function Diskon() {
  const [diskon, setDiskon] = useState<DiskonView>({
    list: [],
    loading: false,
    last: false,
    page: 1,
    limit: 50,
  });
  const [show, setShow] = useState<boolean>(false);
  const [item, setItem] = useState<DiskonAPI>();

  useEffect(() => {
    fetchDiskon(1);
  }, []);

  const fetchDiskon = async (page: number) => {
    try {
      setDiskon(prev => ({
        ...prev,
        loading: true,
      }));

      const res = await listDiskon({ page, pageSize: diskon.limit });

      setDiskon(prev => ({
        ...prev,
        last: res.length !== diskon.limit,
        list: page === 1 ? res : [...prev.list, ...res],
        page,
      }));
    } finally {
      setDiskon(prev => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const onSubmit = async (payload: DiskonPayload) => {
    if (item) {
      await updateDiskon(item.id, payload);
    } else {
      await createDiskon(payload);
    }
    await fetchDiskon(1);
  };

  const updateStatus = async (item: DiskonAPI) => {
    clearTimeout(time);
    console.log('updateStatus', time);

    time = setTimeout(async () => {
      await updateDiskon(item.id, {
        nama: item.nama,
        type: item.type,
        value: item.value,
        start_diskon: dateValue(new Date(item.start_diskon)),
        end_diskon: item.end_diskon ? dateValue(new Date(item.end_diskon)) : null,
        status: !item.status,
      });
      await fetchDiskon(1);
    }, 1000);
  };

  const removeList = async (id: string) => {
    clearTimeout(time);
    console.log('removeDiskon', time);
    time = setTimeout(async () => {
      await removeDiskon(id);
      await fetchDiskon(1);
    }, 1000);
  };

  const translateType = (type: DiskonAPI['type']) => {
    if (type === 'percent') return '%';
    return 'Rp';
  };

  return (
    <div className="flex flex-col gap-2">
      <FormDiskon show={show} setShow={() => setShow(false)} submit={onSubmit} row={item} />
      <header className="h-12 border-b flex items-center px-2 gap-2">
        <div className="border flex-auto overflow-hidden h-8 rounded-full">
          <input
            type="text"
            inputMode="search"
            placeholder="Cari ...."
            className="w-full text-sm px-4 h-full outline-none"
            // onKeyDown={handleSearch}
          />
        </div>
        <button className="h-8 aspect-square shrink-0" onClick={() => setShow(true)}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </header>
      <ScrollElement
        next={() => fetchDiskon(diskon.page + 1)}
        loader={
          <div className="w-full flex justify-center h-6 mb-6">
            <PropagateLoader color="var(--primary)" />
          </div>
        }
        className="px-2"
        last={diskon.last}
        isLoading={diskon.loading}
        dataLength={diskon.list.length}
      >
        {diskon.list.map((item, i) => (
          <ScrollElement.Body index={i} className="flex items-start justify-between gap-1 p-2 border-b" key={i}>
            <div
              className="flex-1 overflow-hidden"
              onClick={() => {
                setShow(true);
                setItem(item);
              }}
            >
              <h1 className="truncate text-base uppercase font-bold">{item.nama}</h1>
              <p className="truncate text-xs">{`Type: ${translateType(item.type)}`}</p>
              <p className="truncate text-xs">{`Value: ${item.value.toLocaleString('id-ID')}`}</p>
              <p className="truncate text-xs">{`Start Date: ${dateValue(new Date(item.start_diskon))}`}</p>
              <p className="truncate text-xs">{`End Date: ${item.end_diskon ?? '-'}`}</p>
            </div>
            <div className="flex gap-2">
              <button
                className={clsx(
                  'border  py-1 px-2 text-xs  font-medium rounded-sm',
                  item.status ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600',
                )}
                onClick={() => updateStatus(item)}
              >
                {item.status ? 'Active' : 'InActive'}
              </button>
              <button className="py-1 px-2 text-red-600" onClick={() => removeList(item.id)}>
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </ScrollElement.Body>
        ))}
      </ScrollElement>
    </div>
  );
}

export default Diskon;
