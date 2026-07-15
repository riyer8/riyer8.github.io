import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const pageShellStyle = {
  width: "100%",
  minHeight: "100vh",
  position: "relative",
  zIndex: 1,
};

/** Slug/detail routes share one key so only top-level pages animate. */
function getTransitionKey(pathname) {
  if (pathname.startsWith("/recent-reads")) return "/recent-reads";
  return pathname;
}

const AnimatedLayout = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const transitionKey = getTransitionKey(location.pathname);
  const isHome = location.pathname === "/";

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [transitionKey]);

  if (prefersReducedMotion) {
    return (
      <div style={pageShellStyle}>
        <Outlet />
      </div>
    );
  }

  return (
    <motion.div
      key={transitionKey}
      style={pageShellStyle}
      initial={isHome ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Outlet />
    </motion.div>
  );
};

export default AnimatedLayout;
