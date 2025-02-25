export const TIME_STEP = 10;
export const MINIMUM_TIME_VALUE = 0;
export const MINIMUM_DURATION_VALUE = 100;
export const MAXIMUM_DURATION_VALUE = 6000;

export const roundToNearestMs = (value: number): number => {
  return Math.round(value / TIME_STEP) * TIME_STEP;
};
