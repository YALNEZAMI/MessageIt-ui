export interface Message {
  conv: string;
  text: string;
  files: File[];
  date: Date;
  ref: string;
  visibility: string[];
  sender: { _id: string };
}
