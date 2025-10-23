import { IEvents } from '../base/Events';
import { BaseCard, CardViewModel, createFromTemplate } from './BaseCard';

export interface PreviewCardViewModel extends CardViewModel {
  description?: string;
}

export class PreviewCard extends BaseCard<PreviewCardViewModel> {
  private descriptionEl: HTMLElement | null;

  constructor(events: IEvents) {
    super(createFromTemplate<HTMLElement>('card-preview'), events);
    this.descriptionEl = this.container.querySelector('.card__text');
  }

  set description(value: string | undefined) {
    if (this.descriptionEl) this.descriptionEl.textContent = value ?? '';
  }
}
