import { SVGProps } from "react";

const AwfulIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect width="72" height="72" fill="url(#pattern0_36_2249)" />
      <defs>
        <pattern
          id="pattern0_36_2249"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_36_2249" transform="scale(0.0138889)" />
        </pattern>
        <image
          id="image0_36_2249"
          width="72"
          height="72"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default AwfulIcon;
