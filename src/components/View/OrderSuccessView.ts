import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class OrderSuccessView extends Component<{ total: number }> {
  private closeButton: HTMLButtonElement;
  private descriptionEl: HTMLElement;
  private events: IEvents;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>('#success'));
    this.events = events;
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );
    this.descriptionEl = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );

    this.closeButton.addEventListener('click', () =>
      this.events.emit('order:success-close')
    );
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }
}
