import React, { FC, PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

interface Props extends PropsWithChildren {
  to: string;
}

const ALink: FC<Props> = ({ children, to }) => {
  return (
    <NavLink
      className={(props) =>
        (props.isActive ? "text-green-500" : "") +
        " hover:bg-lime-100  w-full py-8 text-center"
      }
      to={to}
    >
      {children}
    </NavLink>
  );
};

export default ALink;
