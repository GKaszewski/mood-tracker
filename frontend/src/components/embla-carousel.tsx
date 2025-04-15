import React, { useCallback, useEffect, useState } from "react";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "react-aria-components";

type PropType = {
  children?: React.ReactNode[];
  options?: EmblaOptionsType;
  showArrows?: boolean;
  itemsPerPage?: number;
};

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { children, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const slideWidth = `${100 / (props.itemsPerPage || 1)}%`;

  return (
    <section>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pinch-zoom touch-pan-y">
          {children?.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: slideWidth }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {props.showArrows && (
        <div className="grid grid-cols-1 justify-between gap-6 mt-6">
          <div className="grid grid-cols-2 gap-2 items-center">
            <Button
              onPress={onPrevButtonClick}
              isDisabled={prevBtnDisabled}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow"
            >
              {"<-"}
            </Button>
            <Button
              onPress={onNextButtonClick}
              isDisabled={nextBtnDisabled}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow"
            >
              {"->"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmblaCarousel;
