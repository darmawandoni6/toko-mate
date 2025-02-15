import { FC } from 'react';

import Modal from '../modal';

interface Props {
  loading?: boolean;
  onClose: () => void;
}
const FooterButton: FC<Props> = ({ onClose, loading = false }) => {
  return (
    <Modal.Footer className="flex justify-end gap-2">
      <button className="rounded py-1 px-2 text-sm font-semibold bg-gray-300" type="button" onClick={onClose}>
        Cancel
      </button>
      <button
        className="rounded py-1 px-2 text-sm font-semibold bg-primary text-white"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </Modal.Footer>
  );
};

export default FooterButton;
