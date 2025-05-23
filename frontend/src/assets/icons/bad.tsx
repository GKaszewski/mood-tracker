import { SVGProps } from "react";

const BadIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect width="72" height="72" fill="url(#pattern0_8_23306)" />
      <defs>
        <pattern
          id="pattern0_8_23306"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_8_23306" transform="scale(0.0138889)" />
        </pattern>
        <image
          id="image0_8_23306"
          width="72"
          height="72"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default BadIcon;
