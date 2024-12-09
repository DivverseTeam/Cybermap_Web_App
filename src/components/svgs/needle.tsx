import React from "react";

export default function Needle() {
  return (
    <svg
      width="25"
      height="54"
      viewBox="0 0 25 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dddd_5510_22247)">
        <path
          d="M13.1628 14.7687C12.7664 15.3571 11.9004 15.3571 11.504 14.7687L5.30039 5.55866C4.85298 4.89443 5.32893 4 6.12978 4L18.537 4C19.3379 4 19.8138 4.89443 19.3664 5.55866L13.1628 14.7687Z"
          fill="#FCFCFD"
        />
        <path
          d="M11.0893 15.048L11.504 14.7687L11.0893 15.048C11.6839 15.9307 12.983 15.9307 13.5775 15.048L19.7811 5.83799C20.4523 4.84165 19.7383 3.5 18.537 3.5L6.12978 3.5C4.9285 3.5 4.21458 4.84165 4.88569 5.83799L11.0893 15.048Z"
          stroke="#F0F0F3"
        />
      </g>
      <line
        x1="11.7673"
        y1="53.9982"
        x2="11.8992"
        y2="17.9982"
        stroke="#FCFCFD"
      />
      <defs>
        <filter
          id="filter0_dddd_5510_22247"
          x="0.126465"
          y="0"
          width="24.4141"
          height="21.21"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="0.5"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_5510_22247"
          />
          <feOffset />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5510_22247"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.176471 0 0 0 0.0901961 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_5510_22247"
            result="effect2_dropShadow_5510_22247"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="erode"
            in="SourceAlpha"
            result="effect3_dropShadow_5510_22247"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_5510_22247"
            result="effect3_dropShadow_5510_22247"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_5510_22247"
            result="effect4_dropShadow_5510_22247"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect4_dropShadow_5510_22247"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
