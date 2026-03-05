import PropTypes from 'prop-types';

export const IconButton = ({ onClick, icon, label, variant = 'secondary', className = '' }) => {
  const variants = {
    primary: 'text-[#cd7f32] hover:bg-[#2a2a2a]',
    secondary: 'text-[#888] hover:text-[#cd7f32] hover:bg-[#2a2a2a]',
    danger: 'text-[#ef4444] hover:bg-[#2a2a2a]',
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2 rounded transition-colors duration-200 ${variants[variant]} ${className}`}
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