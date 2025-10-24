import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CardViewModel } from './BaseCard';

export class CatalogView extends Component<CardViewModel[]> {
  private listEl: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.listEl = container;
  }

  set items(value: HTMLElement[]) {
    this.listEl.replaceChildren(...value);
  }
}
