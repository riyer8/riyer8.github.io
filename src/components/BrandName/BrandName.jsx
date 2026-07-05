import React from "react";

/** Brand name lockup — Playfair Display Bold; last name italicized. */
const BrandName = ({ className = "", style = {}, lowercase = false }) => {
  const given = lowercase ? "ramya" : "Ramya";
  const family = lowercase ? "iyer" : "Iyer";

  return (
    <span className={`brand-name ${className}`.trim()} style={style}>
      <span className="brand-name__given">{given}</span>{" "}
      <span className="brand-name__family">{family}</span>
    </span>
  );
};

export default BrandName;
