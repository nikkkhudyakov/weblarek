import { CDN_URL, categoryMap } from '../../utils/constants';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface CardViewModel {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  inCart?: boolean;
  description?: string;
}

export abstract class BaseCard<T extends CardViewModel> extends Component<T> {
  protected _id: string = '';
  protected titleEl: HTMLElement;
  protected imageEl: HTMLImageElement | null;
  protected categoryEl: HTMLElement | null;
  protected priceEl: HTMLElement | null;
  protected actionButton: HTMLButtonElement | null;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.titleEl = ensureElement<HTMLElement>('.card__title', this.container);
    this.imageEl = this.container.querySelector('.card__image');
    this.categoryEl = this.container.querySelector('.card__category');
    this.priceEl = this.container.querySelector('.card__price');
    this.actionButton = this.container.querySelector('.card__button');

    this.container.addEventListener('click', (e) => {
      if (
        this.actionButton &&
        e.target instanceof HTMLElement &&
        this.actionButton.contains(e.target)
      ) {
        this.events.emit('card:action', { id: this._id });
        return;
      }
      this.events.emit('card:click', { id: this._id });
    });
  }

  set id(value: string) {
    this._id = value;
    this.container.dataset.id = value;
  }

  get id(): string {
    return this._id;
  }

  set title(value: string) {
    if (this.titleEl) this.titleEl.textContent = value;
  }

  set image(value: { src: string; alt?: string } | string) {
    if (!this.imageEl) return;
    const src = typeof value === 'string' ? value : value.src;
    const alt = typeof value === 'string' ? '' : value.alt ?? '';

    // Преобразуем .svg в .png для корректного отображения
    const imageSrc = src.endsWith('.svg')
      ? `${CDN_URL}/${src.slice(0, -4)}.png`
      : `${CDN_URL}/${src}`;

    this.setImage(this.imageEl, imageSrc, alt);
  }

  set category(value: string) {
    if (!this.categoryEl) return;
    this.categoryEl.textContent = value;
    // reset known modifiers
    Object.values(categoryMap).forEach((cls) =>
      this.categoryEl!.classList.remove(cls)
    );
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) this.categoryEl.classList.add(modifier);
  }

  set price(value: number | null) {
    if (this.priceEl) {
      this.priceEl.textContent =
        value === null ? 'Бесценно' : `${value} синапсов`;
    }
    if (this.actionButton) {
      if (value === null) {
        this.actionButton.disabled = true;
        this.actionButton.textContent = 'Недоступно';
      } else {
        this.actionButton.disabled = false;
      }
    }
  }

  set inCart(value: boolean | undefined) {
    if (!this.actionButton) return;
    if (this.actionButton.disabled) return; // недоступный товар
    this.actionButton.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }

  render(data?: Partial<T>): HTMLElement {
    return super.render(data);
  }
}

export function createFromTemplate<T extends HTMLElement>(
  templateId: string
): T {
  return cloneTemplate<T>(`#${templateId}`);
}
