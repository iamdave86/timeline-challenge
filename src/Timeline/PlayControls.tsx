import { useCallback } from "react";

import { NumberInput } from "./NumberInput";
import {
  MAXIMUM_DURATION_VALUE,
  MINIMUM_DURATION_VALUE,
  MINIMUM_TIME_VALUE,
  roundToNearestMs,
  TIME_STEP,
} from "./Timeline.constants";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
};

export const PlayControls = ({ time, setTime, duration, setDuration }: PlayControlsProps) => {
  const handleChangeTime = useCallback(
    (value: number) => {
      // clamp the value between the minimum and maximum time values
      // and round it to the nearest millisecond
      // its maximum value is the duration
      const clampedTime = Math.max(MINIMUM_TIME_VALUE, Math.min(value, duration));
      const roundedTime = roundToNearestMs(clampedTime);
      setTime(roundedTime);
    },
    [setTime, duration],
  );

  const handleChangeDuration = useCallback(
    (value: number) => {
      // clamp the value between the minimum and maximum duration values
      // and round it to the nearest millisecond
      const clampedDuration = Math.max(MINIMUM_DURATION_VALUE, Math.min(MAXIMUM_DURATION_VALUE, value));
      const roundedDuration = roundToNearestMs(clampedDuration);
      setDuration(roundedDuration);

      // if the current time is greater than the new duration, then set the current time to the new duration
      if (time > roundedDuration) {
        setTime(roundedDuration);
      }
    },
    [time, setTime, setDuration],
  );

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 
px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        <NumberInput
          dataTestId="current-time-input"
          label="Current"
          value={time}
          min={MINIMUM_TIME_VALUE}
          max={duration}
          step={TIME_STEP}
          onChange={handleChangeTime}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInput
          dataTestId="duration-input"
          label="Duration"
          labelPosition="after"
          min={MINIMUM_DURATION_VALUE}
          max={MAXIMUM_DURATION_VALUE}
          value={duration}
          step={TIME_STEP}
          onChange={handleChangeDuration}
        />
      </fieldset>
    </div>
  );
};
