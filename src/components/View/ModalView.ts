import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class ModalView extends Component<unknown> {
  private containerEl: HTMLElement;
  private contentEl: HTMLElement;
  private closeButton: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.containerEl = this.container;
    this.contentEl = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    // закрытие по клику на крестик
    this.closeButton.addEventListener('click', () => this.close());
    // закрытие по клику на оверлей (вне контейнера контента)
    this.containerEl.addEventListener('click', (e) => {
      if (e.target === this.containerEl) this.close();
    });
  }

  open(content: HTMLElement) {
    this.contentEl.replaceChildren(content);
    this.containerEl.classList.add('modal_active');
  }

  close() {
    this.containerEl.classList.remove('modal_active');
    this.contentEl.replaceChildren();
    this.events.emit('modal:close');
  }
}
