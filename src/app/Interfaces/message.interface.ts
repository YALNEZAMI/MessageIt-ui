export interface Message {
  conv: string;
  text: string;
  files: File[];
  date: Date;
  ref: string;
  invisiblity: string[];
  sender: { _id: string };
}
