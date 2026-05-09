import { Injectable } from '@angular/core';
import { FormElement, ThemeConfig } from '../models/form-element.model';

export interface FormBuilderState {
  title: string;
  description: string;
  elements: FormElement[];
  theme: ThemeConfig;
}

/**
 * Simple persistence layer that stores the entire form builder state in localStorage.
 */
@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private storageKey = 'formBuilderState';

  /** Save current state to localStorage */
  save(state: FormBuilderState): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist form builder state', e);
    }
  }

  /** Load state from localStorage */
  load(): FormBuilderState | null {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (!json) return null;
      return JSON.parse(json) as FormBuilderState;
    } catch (e) {
      console.error('Failed to load form builder state', e);
      return null;
    }
  }
}
