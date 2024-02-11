import { Link } from "react-router-dom";

export default function NavButton({ active, position, label, icon, route }) {
  const className = [
    'inline-block px-4 py-2 text-sm font-medium focus:ring-2',
    active ? 'bg-white text-black' : 'border border-gray-500 hover:bg-gray-300 hover:text-gray-900',
    position === 'first' ? 'rounded-s-lg' : position === 'last' ? 'rounded-e-lg' : ''
  ].join(' ').trim();

  if (active) return (
    <span className={className}>
      <i className={`fa-solid ${icon} mr-1`}></i>
      <span className="max-md:hidden">{label}</span>
    </span>
  );

  return (
    <Link to={route}>
      <span className={className}>
        <i className={`fa-solid ${icon} mr-1`}></i>
        <span className="max-md:hidden">{label}</span>
      </span>
    </Link>
  )
}