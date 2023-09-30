export interface Message {
  conv: string;
  text: string;
  files: any[];
  date: Date;
  ref: string;
  invisiblity: string[];
  sender: { _id: string };
}
