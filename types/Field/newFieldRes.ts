export interface FieldData {
  id: string;
}
export interface NewFieldRes {
  status: boolean;
  message?: string;
  data?: FieldData;
}
