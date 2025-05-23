const GoodIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
      <rect width="72" height="72" fill="url(#pattern0_36_2204)" />
      <defs>
        <pattern
          id="pattern0_36_2204"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_36_2204" transform="scale(0.0138889)" />
        </pattern>
        <image
          id="image0_36_2204"
          width="72"
          height="72"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default GoodIcon;
