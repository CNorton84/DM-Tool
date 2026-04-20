import PropTypes from 'prop-types';

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 sm:px-4 sm:py-2 font-bold rounded transition-colors duration-200 text-xs sm:text-sm';
  const variants = {
    primary: 'bg-[#cd7f32] text-[#0a0a0a] hover:bg-[#b86d2a]',
    secondary: 'bg-[#1a1a1a] text-[#cd7f32] hover:bg-[#2a2a2a]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  className: PropTypes.string,
};