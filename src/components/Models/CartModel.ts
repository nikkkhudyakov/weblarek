import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CartModel {
  private items: IProduct[] = [];
  private events?: IEvents;

  constructor(initialItems?: IProduct[], events?: IEvents) {
    if (initialItems) {
      this.items = initialItems;
    }
    this.events = events;
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public add(product: IProduct): void {
    this.items.push(product);
    this.events?.emit('cart:changed', { items: this.items.slice() });
  }

  public remove(productId: string): void {
    this.items = this.items.filter((p) => p.id !== productId);
    this.events?.emit('cart:changed', { items: this.items.slice() });
  }

  public clear(): void {
    this.items = [];
    this.events?.emit('cart:changed', { items: this.items.slice() });
  }

  public getTotal(): number {
    return this.items.reduce(
      (sum, p) => sum + (typeof p.price === 'number' ? p.price : 0),
      0
    );
  }

  public getCount(): number {
    return this.items.length;
  }

  public has(productId: string): boolean {
    return this.items.some((p) => p.id === productId);
  }
}
