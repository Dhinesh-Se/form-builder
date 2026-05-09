import { Injectable, signal } from '@angular/core';
import {
  FormElement,
  FormElementDefinition,
  FormElementOption,
  ThemeConfig,
  DEFAULT_THEME,
} from '../models/form-element.model';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  readonly componentDefinitions: FormElementDefinition[] = [
    { type: 'text', label: 'Text Input', icon: 'T', category: 'Basic', placeholder: 'Enter text' },
    { type: 'textarea', label: 'Text Area', icon: '¶', category: 'Basic', placeholder: 'Enter text...' },
    { type: 'email', label: 'Email', icon: '@', category: 'Basic', placeholder: 'you@example.com' },
    { type: 'number', label: 'Number', icon: '#', category: 'Basic', placeholder: '0' },
    { type: 'password', label: 'Password', icon: '🔒', category: 'Basic', placeholder: '••••••••' },
    { type: 'tel', label: 'Phone', icon: '📞', category: 'Basic', placeholder: '+1 (555) 000-0000' },
    { type: 'url', label: 'Website URL', icon: '🔗', category: 'Basic', placeholder: 'https://' },
    { type: 'date', label: 'Date', icon: '📅', category: 'Date & Time' },
    { type: 'time', label: 'Time', icon: '⏰', category: 'Date & Time' },
    { type: 'datetime-local', label: 'Date & Time', icon: '🗓️', category: 'Date & Time' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑', category: 'Choice' },
    {
      type: 'radio',
      label: 'Radio Group',
      icon: '◉',
      category: 'Choice',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    },
    {
      type: 'select',
      label: 'Dropdown',
      icon: '▾',
      category: 'Choice',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    },
    { type: 'range', label: 'Slider', icon: '⟺', category: 'Advanced' },
    { type: 'color', label: 'Color Picker', icon: '🎨', category: 'Advanced' },
    { type: 'file', label: 'File Upload', icon: '📎', category: 'Advanced' },
    { type: 'heading', label: 'Heading', icon: 'H', category: 'Layout' },
    { type: 'divider', label: 'Divider', icon: '—', category: 'Layout' },
    { type: 'button', label: 'Submit Button', icon: '▶', category: 'Action' },
  ];

  formElements: FormElement[] = [];
  private nextId = 1;
  theme = signal<ThemeConfig>({ ...DEFAULT_THEME });
  formTitle = signal<string>('My Form');
  formDescription = signal<string>('Fill out the form below.');
  previewMode = signal<boolean>(false);

  get categories(): string[] {
    return [...new Set(this.componentDefinitions.map((d) => d.category))];
  }

  getByCategory(category: string): FormElementDefinition[] {
    return this.componentDefinitions.filter((d) => d.category === category);
  }

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
      element.id === id ? { ...element, ...changes } : element
    );
  }

  updateElementOptions(id: number, optionsText: string): void {
    this.updateElement(id, { options: this.parseOptions(optionsText) });
  }

  duplicateElement(id: number): void {
    const index = this.formElements.findIndex((element) => element.id === id);
    if (index === -1) return;
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
    if (previousIndex === currentIndex) return;
    const [element] = this.formElements.splice(previousIndex, 1);
    this.formElements.splice(currentIndex, 0, element);
  }

  moveElementById(id: number, direction: -1 | 1): void {
    const index = this.formElements.findIndex((element) => element.id === id);
    const nextIndex = index + direction;
    if (index === -1 || nextIndex < 0 || nextIndex >= this.formElements.length) return;
    this.moveElement(index, nextIndex);
  }

  removeElement(id: number): void {
    this.formElements = this.formElements.filter((el) => el.id !== id);
  }

  clearAll(): void {
    this.formElements = [];
  }

  updateTheme(partial: Partial<ThemeConfig>): void {
    this.theme.set({ ...this.theme(), ...partial });
  }

  applyPreset(preset: ThemeConfig): void {
    this.theme.set({ ...preset });
  }

  private createElement(definition: FormElementDefinition): FormElement {
    return {
      ...definition,
      id: this.nextId++,
      required: false,
      width: 'full',
      options: definition.options?.map((option) => ({ ...option })),
    };
  }

  private getComponentDefinition(type: string): FormElementDefinition {
    return (
      this.componentDefinitions.find((component) => component.type === type) ?? {
        type,
        label: type,
        icon: '?',
        category: 'Basic',
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
