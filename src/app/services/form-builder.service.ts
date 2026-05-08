import { Injectable } from '@angular/core';
import {
  FormElement,
  FormElementDefinition,
  FormElementOption,
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
    {
      type: 'radio',
      label: 'Radio Button',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    },
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
  private nextId = 1;

  addElement(type: string, index?: number): void {
    const definition = this.getComponentDefinition(type);
    const element = this.createElement(definition);

    if (index === undefined || index < 0 || index > this.formElements.length) {
      this.formElements.push(element);
      return;
    }

    this.formElements.splice(index, 0, element);
  }

  updateElement(id: number, changes: Partial<FormElement>): void {
    this.formElements = this.formElements.map((element) =>
      element.id === id ? { ...element, ...changes } : element,
    );
  }

  updateElementOptions(id: number, optionsText: string): void {
    this.updateElement(id, {
      options: this.parseOptions(optionsText),
    });
  }

  duplicateElement(id: number): void {
    const index = this.formElements.findIndex((element) => element.id === id);

    if (index === -1) {
      return;
    }

    const current = this.formElements[index];
    const duplicate: FormElement = {
      ...current,
      id: this.nextId++,
      label: `${current.label} Copy`,
      options: current.options?.map((option) => ({ ...option })),
    };

    this.formElements.splice(index + 1, 0, duplicate);
  }

  moveElement(previousIndex: number, currentIndex: number): void {
    if (previousIndex === currentIndex) {
      return;
    }

    const [element] = this.formElements.splice(previousIndex, 1);
    this.formElements.splice(currentIndex, 0, element);
  }

  moveElementById(id: number, direction: -1 | 1): void {
    const index = this.formElements.findIndex((element) => element.id === id);
    const nextIndex = index + direction;

    if (index === -1 || nextIndex < 0 || nextIndex >= this.formElements.length) {
      return;
    }

    this.moveElement(index, nextIndex);
  }

  removeElement(id: number): void {
    this.formElements = this.formElements.filter((el) => el.id !== id);
  }

  clearAll(): void {
    this.formElements = [];
  }

  private createElement(definition: FormElementDefinition): FormElement {
    return {
      ...definition,
      id: this.nextId++,
      required: false,
      options: definition.options?.map((option) => ({ ...option })),
    };
  }

  private getComponentDefinition(type: string): FormElementDefinition {
    return (
      this.componentDefinitions.find((component) => component.type === type) ?? {
        type,
        label: type,
      }
    );
  }

  private parseOptions(optionsText: string): FormElementOption[] {
    return optionsText
      .split('\n')
      .map((option) => option.trim())
      .filter(Boolean)
      .map((option) => ({
        label: option,
        value: option.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      }));
  }
}
