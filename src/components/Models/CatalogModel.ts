import { IProduct } from '../../types';

export class CatalogModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(initialProducts?: IProduct[]) {
    if (initialProducts) {
      this.products = initialProducts;
    }
  }

  public setProducts(products: IProduct[]): void {
    this.products = products;
  }

  public getProducts(): IProduct[] {
    return this.products;
  }

  public getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  public setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
  }

  public getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
