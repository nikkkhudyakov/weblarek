import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CardViewModel } from './BaseCard';
import { CatalogCard } from './CatalogCard';

export class CatalogView extends Component<CardViewModel[]> {
  private listEl: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.listEl = container;
  }

  set items(value: CardViewModel[]) {
    const cards = value.map((vm) => {
      const card = new CatalogCard(this.events);
      return card.render(vm);
    });
    this.listEl.replaceChildren(...cards);
  }
}
