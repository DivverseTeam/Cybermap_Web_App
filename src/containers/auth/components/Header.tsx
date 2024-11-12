"use client";

import { CyberMapLogo } from "~/components/svgs/CyberMapLogo";
import RightArrow from "~/components/svgs/rightArrow";

function Header() {
  return (
    <div className="mx-auto flex h-24 w-full max-w-[1442px] select-none items-center justify-between pt-5 pr-20 pb-5 pl-20">
      <div className="flex items-center gap-2">
        <CyberMapLogo />
        <span className="font-semibold text-black text-sm">CyberMap</span>
      </div>
      <div className="flex cursor-pointer items-center gap-3 transition-transform duration-300 hover:scale-105">
        <span className="text-[#768EA7]">Go back to website</span>

        <RightArrow />
      </div>
    </div>
  );
}

export default Header;
