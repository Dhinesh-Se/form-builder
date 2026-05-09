import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormElement, ThemeConfig } from '../../models/form-element.model';

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
  activeTab: 'html' | 'css' | 'ts' = 'html';
  generatedCss = '';
  generatedTs = '';
  copyLabel = 'Copy';

  constructor(private formService: FormBuilderService) {}

  generate(): void {
    if (this.formService.formElements.length === 0) {
      alert('Please add at least one field first!');
      return;
    }
    const elements = this.formService.formElements;
    const theme = this.formService.theme();
    this.generatedCode = this.buildHtml(elements);
    this.generatedCss = this.buildCss(theme);
    this.generatedTs = this.buildTs(elements);
    this.activeTab = 'html';
    this.showModal = true;
  }

  get currentCode(): string {
    if (this.activeTab === 'html') return this.generatedCode;
    if (this.activeTab === 'css') return this.generatedCss;
    return this.generatedTs;
  }

  private buildHtml(elements: FormElement[]): string {
    const lines: string[] = [];
    lines.push('<form (ngSubmit)="onSubmit()" #myForm="ngForm" class="form-container">');
    for (const el of elements) {
      const name = this.toControlName(el.label, el.id);
      const req = el.required ? ' required' : '';
      const placeholder = el.placeholder ? ` placeholder="${this.escapeAttr(el.placeholder)}"` : '';

      if (el.type === 'heading') {
        lines.push(`  <h2 class="form-heading">${this.escapeHtml(el.label)}</h2>`);
      } else if (el.type === 'divider') {
        lines.push(`  <hr class="form-divider" />`);
      } else if (el.type === 'button') {
        lines.push(`  <button type="submit" class="form-btn">${this.escapeHtml(el.label)}</button>`);
      } else if (el.type === 'textarea') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>`);
        lines.push(`    <textarea id="${name}" name="${name}" [(ngModel)]="form.${name}"${placeholder}${req}></textarea>`);
        if (el.helpText) lines.push(`    <small>${this.escapeHtml(el.helpText)}</small>`);
        lines.push(`  </div>`);
      } else if (el.type === 'checkbox') {
        lines.push(`  <div class="form-group form-check">`);
        lines.push(`    <input type="checkbox" id="${name}" name="${name}" [(ngModel)]="form.${name}"${req}>`);
        lines.push(`    <label for="${name}">${this.escapeHtml(el.label)}</label>`);
        lines.push(`  </div>`);
      } else if (el.type === 'radio') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label>${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>`);
        for (const opt of el.options ?? []) {
          const oid = `${name}_${opt.value}`;
          lines.push(`    <div class="radio-option"><input type="radio" id="${oid}" name="${name}" [(ngModel)]="form.${name}" value="${this.escapeAttr(opt.value)}"${req}> <label for="${oid}">${this.escapeHtml(opt.label)}</label></div>`);
        }
        lines.push(`  </div>`);
      } else if (el.type === 'select') {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>`);
        lines.push(`    <select id="${name}" name="${name}" [(ngModel)]="form.${name}"${req}>`);
        lines.push(`      <option value="">Select an option</option>`);
        for (const opt of el.options ?? []) lines.push(`      <option value="${this.escapeAttr(opt.value)}">${this.escapeHtml(opt.label)}</option>`);
        lines.push(`    </select>`);
        lines.push(`  </div>`);
      } else {
        lines.push(`  <div class="form-group">`);
        lines.push(`    <label for="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>`);
        lines.push(`    <input type="${el.type}" id="${name}" name="${name}" [(ngModel)]="form.${name}"${placeholder}${req}>`);
        if (el.helpText) lines.push(`    <small>${this.escapeHtml(el.helpText)}</small>`);
        lines.push(`  </div>`);
      }
    }
    lines.push('</form>');
    return lines.join('\n');
  }

  private buildCss(t: ThemeConfig): string {
    return `.form-container {
  background: ${t.surfaceColor};
  font-family: ${t.fontFamily};
  font-size: ${t.fontSize};
  color: ${t.textColor};
  padding: 32px;
  border-radius: ${t.borderRadius};
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: ${t.spacing};
}

.form-group label {
  font-weight: 600;
  color: ${t.labelColor};
  font-size: ${t.fontSize};
}

.form-group input,
.form-group textarea,
.form-group select {
  border: 1.5px solid ${t.borderColor};
  border-radius: ${t.borderRadius};
  background: ${t.inputBg};
  color: ${t.textColor};
  padding: 10px 12px;
  font-size: ${t.fontSize};
  font-family: ${t.fontFamily};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: ${t.primaryColor};
  box-shadow: 0 0 0 3px ${t.primaryColor}25;
}

.req { color: ${t.primaryColor}; }

.form-heading {
  font-size: 20px;
  font-weight: 700;
  color: ${t.textColor};
  margin: 8px 0 ${t.spacing};
}

.form-divider {
  border: none;
  border-top: 1.5px solid ${t.borderColor};
  margin: 8px 0 ${t.spacing};
}

.form-btn {
  background: ${t.primaryColor};
  color: ${t.buttonTextColor};
  border: none;
  border-radius: ${t.borderRadius};
  padding: 11px 28px;
  font-size: ${t.fontSize};
  font-weight: 600;
  cursor: pointer;
  font-family: ${t.fontFamily};
  transition: filter 0.15s;
}

.form-btn:hover { filter: brightness(1.1); }

.form-check {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

small { font-size: 11px; opacity: 0.6; }`;
  }

  private buildTs(elements: FormElement[]): string {
    const fields = elements
      .filter((el) => !['heading', 'divider'].includes(el.type))
      .map((el) => `    ${this.toControlName(el.label, el.id)}: ${el.type === 'checkbox' ? 'false' : "''"},`)
      .join('\n');
    return `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.css'],
})
export class MyFormComponent {
  form = {
${fields}
  };

  onSubmit() {
    console.log('Form submitted:', this.form);
    // TODO: Add your submission logic here
  }
}`;
  }

  private toControlName(label: string, id: number): string {
    return (label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'field') + '_' + id;
  }

  private escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private escapeAttr(value: string): string {
    return this.escapeHtml(value).replace(/"/g, '&quot;');
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.currentCode);
      this.copyLabel = '✓ Copied!';
    } catch {
      this.copyLabel = 'Failed';
    } finally {
      setTimeout(() => (this.copyLabel = 'Copy'), 2000);
    }
  }

  closeModal() { this.showModal = false; }
}
