import { NapResObj } from '../Nap/NapResObj';

export interface GetCurrentlyOpenWorkDayRes {
  startDate: Date;
  id: string;
  naps: NapResObj[];
}
