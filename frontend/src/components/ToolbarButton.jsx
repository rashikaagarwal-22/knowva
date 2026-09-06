const ToolbarButton = ({
  onClick,
  active = false,
  title,
  disabled,
  children,
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      className={`
        w-10
        h-10
        rounded-md
        flex
        items-center
        justify-center
        transition

        ${
        disabled
        ? "opacity-40 cursor-not-allowed"
        : active
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700"
        }
        `}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;