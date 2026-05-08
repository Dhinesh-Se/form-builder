import { Injectable } from '@angular/core';
import { FormElement } from '../models/form-element.model';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  formElements: FormElement[] = [];

  addElement(type: string): void {
    const labels: Record<string, string> = {
      text: 'TextBox',
      textarea: 'TextArea',
      email: 'Email',
      checkbox: 'Checkbox',
      radio: 'Radio Button',
      button: 'Button',
    };
    this.formElements.push({
      id: Date.now(),
      type,
      label: labels[type] || type,
      required: false,
    });
  }

  removeElement(id: number): void {
    this.formElements = this.formElements.filter((el) => el.id !== id);
  }

  clearAll(): void {
    this.formElements = [];
  }
}
