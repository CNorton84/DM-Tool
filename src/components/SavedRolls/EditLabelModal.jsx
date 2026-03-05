import { useState } from 'react';
import PropTypes from 'prop-types';

export const EditLabelModal = ({ roll, onSave, onClose }) => {
  const [label, setLabel] = useState(roll.label || '');

  const handleSave = () => {
    onSave(roll.id, { label: label.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#cd7f32] rounded-lg p-6 w-96">
        <h3 className="text-[#cd7f32] font-bold text-lg mb-4">Edit Roll Label</h3>
        <p className="text-[#888] text-sm mb-2">{roll.formula} = {roll.total}</p>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter a label (optional)"
          className="w-full bg-[#0a0a0a] border border-[#cd7f32] rounded px-3 py-2 text-[#e0e0e0] mb-4 focus:outline-none focus:ring-2 focus:ring-[#cd7f32]"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0a0a0a] border border-[#cd7f32] text-[#cd7f32] rounded hover:bg-[#2a2a2a]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#cd7f32] text-[#0a0a0a] font-bold rounded hover:bg-[#b86d2a]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

EditLabelModal.propTypes = {
  roll: PropTypes.shape({
    id: PropTypes.string.isRequired,
    formula: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    label: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
