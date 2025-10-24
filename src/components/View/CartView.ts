import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CartItemViewModel } from './CartItemCard';

export class CartView extends Component<{
  items: CartItemViewModel[];
  total: number;
  canCheckout: boolean;
}> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private events: IEvents;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>('#basket'));
    this.events = events;
    this.listEl = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalEl = ensureElement<HTMLElement>('.basket__price', this.container);
    this.checkoutButton = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container
    );
    // Явно укажем тип кнопки, чтобы избежать нежелательного submit в возможном контексте формы
    this.checkoutButton.type = 'button';

    this.checkoutButton.addEventListener('click', () =>
      this.events.emit('cart:checkout')
    );
  }

  set items(value: HTMLElement[]) {
    if (value.length === 0) {
      this.listEl.replaceChildren(document.createTextNode('Корзина пуста'));
    } else {
      this.listEl.replaceChildren(...value);
    }
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }

  set canCheckout(value: boolean) {
    this.checkoutButton.disabled = !value;
  }
}
