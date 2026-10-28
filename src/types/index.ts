export type FieldType = '5 người' | '7 người';
export type FieldStatus = 'Hoạt động' | 'Bảo trì';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  pricePerHour: number;
  status: FieldStatus;
}

export interface Booking {
  id: string;
  fieldId: string;
  customerName: string;
  phone: string;
  date: string;
  startHour: number;
  hours: number;
}

export interface AppData {
  fields: Field[];
  bookings: Booking[];
}
export interface FieldInput {
  name: string;
  type: FieldType;
  pricePerHour: string;
  status: FieldStatus;
}
export interface BookingInput {
  customerName: string;
  phone: string;
  date: string;
  startHour: string;
  hours: string;
}
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export interface AppContextValue extends AppData {
  saving: boolean;
  saveField: (input: FieldInput, id?: string) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  addBooking: (fieldId: string, input: BookingInput) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}
export type RootStackParamList = {
  MainTabs: undefined;
  FieldForm: { fieldId?: string } | undefined;
  FieldDetail: { fieldId: string };
};

export type MainTab = 'overview' | 'fields' | 'bookings';
