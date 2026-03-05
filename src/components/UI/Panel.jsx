import PropTypes from 'prop-types';

export const Panel = ({ title, children, className = '', ...props }) => {
  return (
    <div
      className={`bg-[#1a1a1a] border border-[#cd7f32] border-opacity-50 rounded-lg p-2 ${className}`}
      {...props}
    >
      {title && (
        <h2 className="text-[#cd7f32] font-bold text-sm mb-2 border-b border-[#cd7f32] pb-1 tracking-wide font-mono">
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