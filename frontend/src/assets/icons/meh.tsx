import { SVGProps } from "react";

const MehIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect width="72" height="72" fill="url(#pattern0_36_2306)" />
      <defs>
        <pattern
          id="pattern0_36_2306"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_36_2306" transform="scale(0.0138889)" />
        </pattern>
        <image
          id="image0_36_2306"
          width="72"
          height="72"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default MehIcon;
