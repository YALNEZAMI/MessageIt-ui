import { User } from './User.interface';

export interface Message {
  conv: string;
  text: string;
  files: File[] | any;
  date: Date;
  ref: Message | any;
  visibility: string[];
  sender: User;
  typeMsg: string;
  _id?: string;
  reactions: any[];
}
