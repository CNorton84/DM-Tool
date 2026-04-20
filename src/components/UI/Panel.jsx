import PropTypes from 'prop-types';

export const Panel = ({ title, children, className = '', ...props }) => {
  return (
    <div
      className={`bg-[#1a1a1a] border border-[#cd7f32] border-opacity-50 rounded-lg p-1.5 sm:p-2 overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <h2 className="text-[#cd7f32] font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 border-b border-[#cd7f32] pb-0.5 sm:pb-1 tracking-wide font-mono">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

Panel.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};