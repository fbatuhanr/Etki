export const getRoundedMinute = (date: Date = new Date(), interval: number = 15): Date => {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / interval) * interval;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};
