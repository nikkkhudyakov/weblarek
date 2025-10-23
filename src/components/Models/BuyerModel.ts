import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';
  private events?: IEvents;

  constructor(initialData?: Partial<IBuyer>, events?: IEvents) {
    if (initialData) {
      this.set(initialData);
    }
    this.events = events;
  }

  public set(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events?.emit('buyer:changed', this.get());
  }

  public get(): IBuyer {
    return {
      payment: this.payment as TPayment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  public clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events?.emit('buyer:changed', this.get());
  }

  public validate(): {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
  } {
    const errors: {
      payment?: string;
      email?: string;
      phone?: string;
      address?: string;
    } = {};
    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.email) errors.email = 'Укажите email';
    if (!this.phone) errors.phone = 'Укажите телефон';
    if (!this.address) errors.address = 'Укажите адрес';
    return errors;
  }
}
