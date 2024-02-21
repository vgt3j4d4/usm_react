import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../routes";
import { MapButtons } from "./MapButtons/MapButtons";
import NavButton from "./NavButton";
import { IterationsButtons } from "./IterationsButtons";

export const BUTTON_NAVIGATION = Object.freeze({
  NEXT: 'next',
  PREV: 'prev',
  FIRST: 'first',
  LAST: 'last'
});

const NAV_BUTTONS = [
  { id: 1, label: 'Roles', iconCls: 'fa-users', route: ROUTES.ROLES },
  { id: 2, label: 'Map', iconCls: 'fa-map', route: ROUTES.MAPPING },
  { id: 3, label: 'Iterations', iconCls: 'fa-stairs', route: ROUTES.ITERATIONS }
];

export function Toolbar() {
  const [activeIndex] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const button = document.getElementById(`toolbar__button_${activeIndex}`);
    if (button) button.focus();
  }, [activeIndex]);

  const isMappingView = pathname === ROUTES.MAPPING;

  return (
    <div role="toolbar" className="fixed top-0 z-10 min-w-full w-full flex justify-between items-center gap-2 p-2 bg-black text-white">

      <nav role="group">
        <ol className="m-0 p-0">
          {NAV_BUTTONS.map((b, index) => (
            <li className="inline" key={b.id}>
              <NavButton
                active={pathname === b.route}
                label={b.label}
                icon={b.iconCls}
                position={index === 0 ? 'first' : index === (NAV_BUTTONS.length - 1) ? 'last' : ''}
                route={b.route} />
            </li>
          ))}
        </ol>
      </nav>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
        {isMappingView ? <MapButtons /> : <IterationsButtons />}
      </div>

      <div>
        <button type="button" className="hidden rounded-full min-w-10 min-h-10">
          <i className="fa-solid fa-user"></i>
        </button>
      </div>

    </div >
  )
}