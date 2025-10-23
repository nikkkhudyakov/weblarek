import { cloneTemplate, ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { BaseForm } from './BaseForm';

export interface Step2Data {
  email: string;
  phone: string;
}
export interface Step2Errors {
  email?: string;
  phone?: string;
}

export class CheckoutFormStep2 extends BaseForm<Step2Data, Step2Errors> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(events: IEvents) {
    super(cloneTemplate<HTMLElement>('#contacts'), events);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );
  }

  protected collectData(): Step2Data {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }
}
