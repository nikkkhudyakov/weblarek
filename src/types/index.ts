export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

// Вид оплаты покупателя
export type TPayment = 'online' | 'cash';

// Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Покупатель
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Ответ списка товаров
export interface ProductListResponse {
  total: number;
  items: IProduct[];
}

// Запрос создания заказа
export interface OrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // массив id товаров
}

// Ответ создания заказа
export interface OrderResponse {
  id: string;
  total: number;
}
