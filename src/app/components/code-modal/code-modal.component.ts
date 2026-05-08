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
      // Convert "Full Name" → "full_name" for HTML attributes
      const name = el.label.toLowerCase().replace(/\s+/g, '_');
      const req = el.required ? ' required' : '';

      if (el.type === 'text' || el.type === 'email') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${el.label}</label>`);
        lines.push(
          `    <input type="${el.type}" id="${name}" name="${name}" [(ngModel)]="form.${name}"${req}>`,
        );
        lines.push(`  </div>`);
      } else if (el.type === 'textarea') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${el.label}</label>`);
        lines.push(
          `    <textarea id="${name}" name="${name}" [(ngModel)]="form.${name}"${req}></textarea>`,
        );
        lines.push(`  </div>`);
      } else if (el.type === 'checkbox') {
        lines.push(`  <div class="form-group">`);
        lines.push(
          `    <input type="checkbox" id="${name}" name="${name}" [(ngModel)]="form.${name}">`,
        );
        lines.push(`    <label for="${name}">${el.label}</label>`);
        lines.push(`  </div>`);
      } else if (el.type === 'radio') {
        lines.push(`  <div class="form-group">`);
        lines.push(
          `    <input type="radio" id="${name}" name="${name}" [(ngModel)]="form.${name}" value="option1">`,
        );
        lines.push(`    <label for="${name}">${el.label}</label>`);
        lines.push(`  </div>`);
      } else if (el.type === 'button') {
        lines.push(`  <button type="submit">${el.label}</button>`);
      }
    }

    lines.push('</form>');
    return lines.join('\n');
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.generatedCode);
    this.copyLabel = '✓ Copied!';
    setTimeout(() => (this.copyLabel = 'Copy Code'), 2000);
  }

  closeModal(): void {
    this.showModal = false;
  }
}
