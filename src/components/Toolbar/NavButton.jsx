import { Link } from "react-router-dom";

export default function NavButton({ active, position, label, icon, route }) {
  const className = [
    'px-4 py-2 text-sm font-medium focus:ring-2',
    active ? 'bg-white text-black' : 'border border-gray-500 hover:bg-gray-300 hover:text-gray-900',
    position === 'first' ? 'rounded-s-lg' : position === 'last' ? 'rounded-e-lg' : ''
  ].join(' ').trim();

  return (
    <Link to={route}>
      <button type="button"
        className={className}
        aria-pressed={active}
        tabIndex={active ? -1 : 0}>
        <i className={`fa-solid ${icon} mr-1`}></i>
        <span className="max-md:hidden">{label}</span>
      </button>
    </Link>
  )
}