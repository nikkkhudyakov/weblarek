import { IEvents } from '../base/Events';
import { BaseCard, CardViewModel, createFromTemplate } from './BaseCard';

export interface CartItemViewModel extends CardViewModel {
  index?: number;
}

export class CartItemCard extends BaseCard<CartItemViewModel> {
  private indexEl: HTMLElement | null;
  private deleteButton: HTMLButtonElement | null;

  constructor(events: IEvents) {
    super(createFromTemplate<HTMLElement>('card-basket'), events);
    this.indexEl = this.container.querySelector('.basket__item-index');
    this.deleteButton = this.container.querySelector('.basket__item-delete');

    if (this.deleteButton) {
      this.deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.events.emit('cart:item-remove', { id: this.id });
      });
    }
  }

  set index(value: number | undefined) {
    if (this.indexEl && typeof value === 'number')
      this.indexEl.textContent = String(value);
  }
}
