import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

export abstract class BaseForm<
  TData extends object,
  TErrors extends object
> extends Component<Partial<TData>> {
  protected formEl: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsEl: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    // If the provided container is already a FORM element, use it directly;
    // otherwise, find a nested form inside the container
    this.formEl =
      this.container instanceof HTMLFormElement
        ? (this.container as HTMLFormElement)
        : ensureElement<HTMLFormElement>('form', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

    this.formEl.addEventListener('input', () => this.onChange());
    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected abstract collectData(): TData;

  protected onChange() {
    this.events.emit('form:change', this.collectData());
  }

  protected onSubmit() {
    if (this.submitButton.disabled) return;
    this.events.emit('form:submit', this.collectData());
  }

  set data(value: Partial<TData>) {
    // реализация в потомках через поля
  }

  set errors(value: Partial<TErrors>) {
    const messages = Object.values(value || {}).filter(Boolean) as string[];
    this.errorsEl.textContent = messages.join('. ');
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  clear() {
    this.formEl.reset();
    this.errorsEl.textContent = '';
    this.submitButton.disabled = true;
  }
}
