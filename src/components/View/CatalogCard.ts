import { IEvents } from '../base/Events';
import { BaseCard, CardViewModel, createFromTemplate } from './BaseCard';

export class CatalogCard extends BaseCard<CardViewModel> {
  constructor(events: IEvents) {
    super(createFromTemplate<HTMLElement>('card-catalog'), events);
  }
}
