import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <DesktopNavbar />
      <MobileNavbar />
    </header>
  );
}
