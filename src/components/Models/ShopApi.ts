import {
  IApi,
  IProduct,
  OrderRequest,
  OrderResponse,
  ProductListResponse,
} from '../../types';
import { API_URL } from '../../utils/constants';

export class ShopApi {
  private api: IApi;
  private readonly base: string;

  constructor(api: IApi, baseUrl: string = API_URL) {
    this.api = api;
    this.base = baseUrl;
  }

  public async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<ProductListResponse>('/product/');
    return res.items;
  }

  public createOrder(data: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>('/order/', data);
  }
}
