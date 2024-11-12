import React from "react";

export default function CategoryList() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <h3 className="font-semibold text-secondary uppercase">
        REQUIREMENT CATEGORIES
      </h3>
      <ul className="flex list-none flex-col gap-4 text-secondary">
        <li>CC1.0 Control Environment</li>
        <li>CC2.0 Communication and information</li>
        <li>CC3.0 Risk Assessment</li>
        <li>CC4.0 Monitoring Activities</li>
        <li>CC5.0 Control Activities</li>
        <li>CC6.0 Logical and Physical Access Controls</li>
        <li>CC7.0 System Operations</li>
      </ul>
    </div>
  );
}
