export class Conv {
  _id: string;
  photo: string;
  name: string;
  description: string;
  members: string[];
  lastMessage: any;
  type: string;
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
  }
}
