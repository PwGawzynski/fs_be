export function countMsBetweenDates(startDate: Date, endDate: Date) {
  const givenTime = new Date(startDate).getTime();
  return (new Date(endDate).getTime() - givenTime) / 1000;
}
