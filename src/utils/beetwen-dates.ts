import { Between } from 'typeorm';

export const GetDatesBetweenForQuery = (startDate: Date, endDate: Date) => {
  return Between(
    new Date(
      new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0,
      ).setHours(0),
    ),
    new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23,
      59,
      59,
      999,
    ),
  );
};
