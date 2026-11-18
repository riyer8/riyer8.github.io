import { useState, useEffect } from "react";
import SidebarContent from "./SidebarContent";

const Sidebar = () => {
  const [shouldCollapseSidebar, setShouldCollapseSidebar] = useState(
    window.innerWidth <= 900
  );
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const checkScreenSize = () => {
      setShouldCollapseSidebar(window.innerWidth <= 900);
      setViewportWidth(window.innerWidth);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // The wide left gutter (6rem) is part of the desktop look, but at
  // narrower widths 20% minus that gutter leaves almost no room for
  // the photo and nav, so shrink the gutter as the screen narrows.
  // Below 900px the sidebar is hidden entirely.
  const leftPadding =
    viewportWidth > 1400 ? "6rem" : viewportWidth > 1200 ? "3rem" : "2rem";

  const sidebarStyle = {
    width: "20%",
    minWidth: 0,
    padding: `5rem 2rem 2rem ${leftPadding}`,
    display: shouldCollapseSidebar ? "none" : "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    background: "transparent",
    minHeight: "100vh",
    position: "relative",
    zIndex: 1,
    transition: "all 0.3s ease",
  };

  return (
    <div style={sidebarStyle}>
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
