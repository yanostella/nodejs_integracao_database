import { ICategory } from './category.interface';

export interface IProduct {
  id?: string; // uuid
  name: string;
  description: string;
  image: string;
  price: number;
  categories?: ICategory[];
}
