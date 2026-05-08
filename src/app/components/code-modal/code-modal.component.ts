import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormElement } from '../../models/form-element.model';

@Component({
  selector: 'app-code-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-modal.component.html',
  styleUrls: ['./code-modal.component.css'],
})
export class CodeModalComponent {
  showModal = false;
  generatedCode = '';
  copyLabel = 'Copy Code';

  constructor(private formService: FormBuilderService) {}

  generate(): void {
    if (this.formService.formElements.length === 0) {
      alert('Please add at least one component to the canvas first!');
      return;
    }
    this.generatedCode = this.buildAngularTemplate(
      this.formService.formElements,
    );
    this.showModal = true;
  }

  // Goes through each element in the JSON array and builds a string
  private buildAngularTemplate(elements: FormElement[]): string {
    const lines: string[] = [];
    lines.push('<form (ngSubmit)="onSubmit()" #myForm="ngForm">');

    for (const el of elements) {
      const name = this.toControlName(el.label, el.id);
      const label = this.escapeHtml(el.label);
      const req = el.required ? ' required' : '';
      const placeholder = this.placeholderAttribute(el);

      if (this.isInputElement(el.type)) {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${label}</label>`);
        lines.push(
          `    <input type="${el.type}" id="${name}" name="${name}" [(ngModel)]="form.${name}"${placeholder}${req}>`,
        );
        lines.push(`  </div>`);
      } else if (el.type === 'textarea') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${label}</label>`);
        lines.push(
          `    <textarea id="${name}" name="${name}" [(ngModel)]="form.${name}"${placeholder}${req}></textarea>`,
        );
        lines.push(`  </div>`);
      } else if (el.type === 'checkbox') {
        lines.push(`  <div class="form-group">`);
        lines.push(
          `    <input type="checkbox" id="${name}" name="${name}" [(ngModel)]="form.${name}"${req}>`,
        );
        lines.push(`    <label for="${name}">${label}</label>`);
        lines.push(`  </div>`);
      } else if (el.type === 'radio') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label>${label}</label>`);
        for (const option of el.options ?? []) {
          const optionId = `${name}_${this.toOptionValue(option.value)}`;
          lines.push(`    <div class="radio-option">`);
          lines.push(
            `      <input type="radio" id="${optionId}" name="${name}" [(ngModel)]="form.${name}" value="${this.escapeAttribute(option.value)}"${req}>`,
          );
          lines.push(
            `      <label for="${optionId}">${this.escapeHtml(option.label)}</label>`,
          );
          lines.push(`    </div>`);
        }
        lines.push(`  </div>`);
      } else if (el.type === 'select') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${label}</label>`);
        lines.push(
          `    <select id="${name}" name="${name}" [(ngModel)]="form.${name}"${req}>`,
        );
        lines.push(`      <option value="">Select an option</option>`);
        for (const option of el.options ?? []) {
          lines.push(
            `      <option value="${this.escapeAttribute(option.value)}">${this.escapeHtml(option.label)}</option>`,
          );
        }
        lines.push(`    </select>`);
        lines.push(`  </div>`);
      } else if (el.type === 'button') {
        lines.push(`  <button type="submit">${label}</button>`);
      }
    }

    lines.push('</form>');
    return lines.join('\n');
  }

  private isInputElement(type: string): boolean {
    return ['text', 'email', 'number', 'password', 'date'].includes(type);
  }

  private placeholderAttribute(element: FormElement): string {
    return element.placeholder
      ? ` placeholder="${this.escapeAttribute(element.placeholder)}"`
      : '';
  }

  private toControlName(label: string, id: number): string {
    const normalizedLabel = label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    return `${normalizedLabel || 'field'}_${id}`;
  }

  private toOptionValue(value: string): string {
    return (
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'option'
    );
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private escapeAttribute(value: string): string {
    return this.escapeHtml(value).replace(/"/g, '&quot;');
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.generatedCode);
      this.copyLabel = '✓ Copied!';
    } catch {
      this.copyLabel = 'Copy failed';
    } finally {
      setTimeout(() => (this.copyLabel = 'Copy Code'), 2000);
    }
  }

  closeModal(): void {
    this.showModal = false;
  }
}
