import PropTypes from 'prop-types';

export const DragHandle = (props) => {
  const { attributes, listeners, className = '' } = props;

  return (
    <button
      {...attributes}
      {...listeners}
      className={`text-[#666] hover:text-[#cd7f32] cursor-grab active:cursor-grabbing p-1 ${className}`}
      aria-label="Drag to reorder"
      tabIndex={-1}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3" r="1.5" />
        <circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="11" cy="13" r="1.5" />
      </svg>
    </button>
  );
};

DragHandle.propTypes = {
  attributes: PropTypes.object,
  listeners: PropTypes.object,
  className: PropTypes.string,
};