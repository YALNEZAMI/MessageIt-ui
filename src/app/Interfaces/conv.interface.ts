import { Theme } from './Theme';

export class Conv {
  _id: string;
  photo: string;
  name: string;
  description: string;
  members: string[];
  lastMessage: any;
  type: string;
  theme: Theme;
  constructor(
    _id: string,
    photo: string,
    name: string,
    description: string,
    members: string[],
    lastMessage: any,
    type: string
  ) {
    this._id = _id;
    this.photo = photo;
    this.name = name;
    this.description = description;
    this.members = members;
    this.lastMessage = lastMessage;
    this.type = type;
    this.theme = 'basic';
  }
}
