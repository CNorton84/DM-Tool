import PropTypes from 'prop-types';

export const IconButton = ({ onClick, icon, label, variant = 'secondary', className = '' }) => {
  const variants = {
    primary: {
      base: 'text-[#cd7f32] border border-[#cd7f32] hover:bg-[#cd7f32] hover:text-[#0a0a0a]',
      hover: 'hover:border-[#cd7f32]',
    },
    secondary: {
      base: 'text-[#888] border border-[#888] hover:text-[#cd7f32] hover:border-[#cd7f32] hover:bg-[#2a2a2a]',
      hover: '',
    },
    danger: {
      base: 'text-[#ef4444] border border-[#ef4444] hover:bg-[#ef4444] hover:text-[#e0e0e0]',
      hover: 'hover:border-[#ef4444]',
    },
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2.5 sm:p-2 rounded transition-colors duration-200 ${variants[variant].base} ${variants[variant].hover} ${className}`}
    >
      {icon}
    </button>
  );
};

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  className: PropTypes.string,
};