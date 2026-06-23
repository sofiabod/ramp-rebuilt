import { useEffect, useState } from "react";

export type Route = "about" | "head-to-head" | "explore";

const routes: Route[] = ["about", "head-to-head", "explore"];

function parse(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "").split(/[#?]/)[0];
  return (routes as string[]).includes(raw) ? (raw as Route) : "about";
}

export function useHashRoute(): [Route, (next: Route) => void] {
  const [route, setRoute] = useState<Route>(parse);

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = (next: Route) => {
    window.location.hash = next;
  };

  return [route, navigate];
}
