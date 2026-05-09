import { Injectable, signal } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { COMPONENT_DEFINITIONS } from '../definitions/component-definitions';
import {
  FormElement,
  FormElementDefinition,
  FormElementOption,
  ThemeConfig,
  DEFAULT_THEME,
} from '../models/form-element.model';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  // Component definitions are now imported from a separate file
  readonly componentDefinitions: FormElementDefinition[] = COMPONENT_DEFINITIONS;

  formElements: FormElement[] = [];
  private nextId = 1;
  theme = signal<ThemeConfig>({ ...DEFAULT_THEME });
  formTitle = signal<string>('My Form');
  formDescription = signal<string>('Fill out the form below.');
  previewMode = signal<boolean>(false);

  constructor(private persistence: PersistenceService) {
    // Load persisted state when the service is instantiated
    const state = this.persistence.load();
    if (state) {
      this.formTitle.set(state.title);
      this.formDescription.set(state.description);
      this.formElements = state.elements ?? [];
      this.theme.set(state.theme ?? { ...DEFAULT_THEME });
      if (this.formElements.length > 0) {
        this.nextId = Math.max(...this.formElements.map(e => e.id)) + 1;
      }
    }
  }

  updateTitle(title: string) {
    this.formTitle.set(title);
    this.saveState();
  }

  updateDescription(description: string) {
    this.formDescription.set(description);
    this.saveState();
  }

  private saveState(): void {
    this.persistence.save({
      title: this.formTitle(),
      description: this.formDescription(),
      elements: this.formElements,
      theme: this.theme(),
    });
  }

  // ---------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------
  get categories(): string[] {
    return [...new Set(this.componentDefinitions.map((d) => d.category))];
  }

  getByCategory(category: string): FormElementDefinition[] {
    return this.componentDefinitions.filter((d) => d.category === category);
  }

  // ---------------------------------------------------------------------
  // Mutations – each mutating method saves the state via PersistenceService
  // ---------------------------------------------------------------------
  addElement(type: string, index?: number): void {
    const definition = this.getComponentDefinition(type);
    const element = this.createElement(definition);
    if (index === undefined || index < 0 || index > this.formElements.length) {
      this.formElements.push(element);
    } else {
      this.formElements.splice(index, 0, element);
    }
    this.saveState();
  }

  updateElement(id: number, changes: Partial<FormElement>): void {
    this.formElements = this.formElements.map((e) => (e.id === id ? { ...e, ...changes } : e));
    this.saveState();
  }

  updateElementOptions(id: number, optionsText: string): void {
    this.updateElement(id, { options: this.parseOptions(optionsText) });
    // updateElement already saves
  }

  duplicateElement(id: number): void {
    const index = this.formElements.findIndex((e) => e.id === id);
    if (index === -1) return;
    const current = this.formElements[index];
    const duplicate: FormElement = {
      ...current,
      id: this.nextId++,
      label: `${current.label} Copy`,
      options: current.options?.map((opt) => ({ ...opt })),
    };
    this.formElements.splice(index + 1, 0, duplicate);
    this.saveState();
  }

  moveElement(previousIndex: number, currentIndex: number): void {
    if (previousIndex === currentIndex) return;
    const [element] = this.formElements.splice(previousIndex, 1);
    this.formElements.splice(currentIndex, 0, element);
    this.saveState();
  }

  moveElementById(id: number, direction: -1 | 1): void {
    const index = this.formElements.findIndex((e) => e.id === id);
    const nextIndex = index + direction;
    if (index === -1 || nextIndex < 0 || nextIndex >= this.formElements.length) return;
    this.moveElement(index, nextIndex);
    // moveElement already saves
  }

  removeElement(id: number): void {
    this.formElements = this.formElements.filter((e) => e.id !== id);
    this.saveState();
  }

  clearAll(): void {
    this.formElements = [];
    this.saveState();
  }

  updateTheme(partial: Partial<ThemeConfig>): void {
    this.theme.set({ ...this.theme(), ...partial });
    this.saveState();
  }

  applyPreset(preset: ThemeConfig): void {
    this.theme.set({ ...preset });
    this.saveState();
  }

  // ---------------------------------------------------------------------
  // Export / Import helpers
  // ---------------------------------------------------------------------
  exportSchema(): string {
    return JSON.stringify({
      title: this.formTitle(),
      description: this.formDescription(),
      elements: this.formElements,
      theme: this.theme(),
    });
  }

  importSchema(jsonStr: string): void {
    try {
      const data = JSON.parse(jsonStr) as {
        title: string;
        description: string;
        elements: FormElement[];
        theme: ThemeConfig;
      };
      if (!data || typeof data.title !== 'string' || !Array.isArray(data.elements)) {
        console.error('Invalid form schema');
        return;
      }
      this.formTitle.set(data.title);
      this.formDescription.set(data.description);
      this.formElements = data.elements;
      this.theme.set(data.theme ?? { ...DEFAULT_THEME });
      this.saveState();
    } catch (e) {
      console.error('Failed to import schema', e);
    }
  }

  // ---------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------
  private createElement(definition: FormElementDefinition): FormElement {
    return {
      ...definition,
      id: this.nextId++,
      required: false,
      width: 'full',
      options: definition.options?.map((opt) => ({ ...opt })),
    };
  }

  private getComponentDefinition(type: string): FormElementDefinition {
    return (
      this.componentDefinitions.find((c) => c.type === type) ?? {
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
      .map((o) => o.trim())
      .filter(Boolean)
      .map((opt) => ({
        label: opt,
        value: opt.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      }));
  }
}
