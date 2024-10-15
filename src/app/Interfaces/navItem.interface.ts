export interface NavItem {
  _id: string;
  name: string;
  route: string;
  icon?: string;
  counterExist: boolean;
  counter?: number;
  svg: string;
}
