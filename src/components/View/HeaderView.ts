import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class HeaderView extends Component<unknown> {
  private basketButton: HTMLButtonElement;
  private counterEl: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.basketButton = ensureElement<HTMLButtonElement>(
      '.header__basket',
      this.container
    );
    this.counterEl = ensureElement<HTMLElement>(
      '.header__basket-counter',
      this.container
    );

    this.basketButton.addEventListener('click', () =>
      this.events.emit('cart:open')
    );
  }

  set count(value: number) {
    this.counterEl.textContent = String(value);
  }
}
