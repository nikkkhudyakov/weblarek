import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  private events?: IEvents;

  constructor(initialProducts?: IProduct[], events?: IEvents) {
    if (initialProducts) {
      this.products = initialProducts;
    }
    this.events = events;
  }

  public setProducts(products: IProduct[]): void {
    this.products = products;
    this.events?.emit('catalog:changed', { products });
  }

  public getProducts(): IProduct[] {
    return this.products;
  }

  public getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  public setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.events?.emit('catalog:selected', { product });
  }

  public getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
