import { Injectable } from '@angular/core';
import {
  FormElement,
  FormElementDefinition,
} from '../models/form-element.model';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  readonly componentDefinitions: FormElementDefinition[] = [
    { type: 'text', label: 'TextBox', placeholder: 'Enter text' },
    { type: 'textarea', label: 'TextArea', placeholder: 'Enter text...' },
    { type: 'email', label: 'Email', placeholder: 'Enter email' },
    { type: 'number', label: 'Number', placeholder: 'Enter number' },
    { type: 'password', label: 'Password', placeholder: 'Enter password' },
    { type: 'date', label: 'Date' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'radio', label: 'Radio Button' },
    {
      type: 'select',
      label: 'Dropdown',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    },
    { type: 'button', label: 'Button' },
  ];

  formElements: FormElement[] = [];

  addElement(type: string): void {
    const definition = this.getComponentDefinition(type);

    this.formElements.push({
      ...definition,
      id: Date.now(),
      required: false,
      options: definition.options?.map((option) => ({ ...option })),
    });
  }

  removeElement(id: number): void {
    this.formElements = this.formElements.filter((el) => el.id !== id);
  }

  clearAll(): void {
    this.formElements = [];
  }

  private getComponentDefinition(type: string): FormElementDefinition {
    return (
      this.componentDefinitions.find((component) => component.type === type) ?? {
        type,
        label: type,
      }
    );
  }
}
