import { Theme } from './Theme';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  password2?: string;
  photo: string;
  theme: Theme;
  operation?: string; //add,remove,accepte,refuse
}
