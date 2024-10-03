"use client";

import { CyberMapLogo } from "~/components/svgs/CyberMapLogo";
import RightArrow from "~/components/svgs/rightArrow";

function Header() {
  return (
    <div className="flex items-center justify-between pt-5 pr-20 pb-5 pl-20 h-24 w-[1442px] mx-auto">
      <div className="flex items-center gap-2">
        <CyberMapLogo />
        <span className="font-semibold text-sm text-black">CyberMap</span>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[#768EA7]">Go back to website</span>
        <RightArrow />
      </div>
    </div>
  );
}

export default Header;
