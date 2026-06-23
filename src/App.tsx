import { useHashRoute } from "./lib/useHashRoute";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { AboutView } from "./views/AboutView";
import { HeadToHeadView } from "./views/HeadToHeadView";
import { ExploreView } from "./views/ExploreView";

export function App() {
  const [route, navigate] = useHashRoute();

  return (
    <>
      <Hero />
      <Nav route={route} onNavigate={navigate} />
      <main>
        {route === "about" && <AboutView />}
        {route === "head-to-head" && <HeadToHeadView />}
        {route === "explore" && <ExploreView />}
      </main>
      <Footer />
    </>
  );
}
