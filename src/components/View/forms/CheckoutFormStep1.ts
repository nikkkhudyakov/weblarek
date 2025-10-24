import { cloneTemplate, ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { BaseForm } from './BaseForm';

export interface Step1Data {
  payment: 'online' | 'cash' | null;
  address: string;
}
export interface Step1Errors {
  payment?: string;
  address?: string;
}

export class CheckoutFormStep1 extends BaseForm<Step1Data, Step1Errors> {
  private btnOnline: HTMLButtonElement;
  private btnCash: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>('#order'), events);
    this.btnOnline = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container
    );
    this.btnCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    const toggle = (target: HTMLButtonElement, other: HTMLButtonElement) => {
      target.classList.add('button_alt-active');
      other.classList.remove('button_alt-active');
      this.onChange();
    };

    this.btnOnline.addEventListener('click', () =>
      toggle(this.btnOnline, this.btnCash)
    );
    this.btnCash.addEventListener('click', () =>
      toggle(this.btnCash, this.btnOnline)
    );

    // Добавляем обработчик для поля адреса
    this.addressInput.addEventListener('input', () => this.onChange());
  }

  protected collectData(): Step1Data {
    const payment = this.btnOnline.classList.contains('button_alt-active')
      ? 'online'
      : this.btnCash.classList.contains('button_alt-active')
      ? 'cash'
      : null;
    return {
      payment,
      address: this.addressInput.value.trim(),
    };
  }
}
