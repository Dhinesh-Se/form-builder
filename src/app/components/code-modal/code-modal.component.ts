import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormElement, ThemeConfig } from '../../models/form-element.model';

@Component({
  selector: 'app-code-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-modal.component.html',
  styleUrls: ['./code-modal.component.css'],
})
export class CodeModalComponent {
  showModal = false;
  framework: 'angular' | 'vanilla' | 'react' = 'angular';
  activeTab: 'html' | 'css' | 'ts' = 'html';
  
  generatedCode = '';
  generatedCss = '';
  generatedTs = '';
  copyLabel = 'Copy';

  constructor(private formService: FormBuilderService) {}

  generate(): void {
    if (this.formService.formElements.length === 0) {
      alert('Please add at least one field first!');
      return;
    }
    this.updateCode();
    this.activeTab = 'html';
    this.showModal = true;
  }

  setFramework(fw: 'angular' | 'vanilla' | 'react'): void {
    this.framework = fw;
    this.updateCode();
    if (fw === 'react' && this.activeTab === 'ts') {
      this.activeTab = 'html';
    }
  }

  updateCode(): void {
    const elements = this.formService.formElements;
    const theme = this.formService.theme();
    this.generatedCss = this.buildCss(theme);

    if (this.framework === 'angular') {
      this.generatedCode = this.buildAngularHtml(elements);
      this.generatedTs = this.buildAngularTs(elements);
    } else if (this.framework === 'vanilla') {
      this.generatedCode = this.buildVanillaHtml(elements);
      this.generatedTs = this.buildVanillaJs(elements);
    } else if (this.framework === 'react') {
      this.generatedCode = this.buildReactJsx(elements);
      this.generatedTs = '';
    }
  }

  get currentCode(): string {
    if (this.activeTab === 'html') return this.generatedCode;
    if (this.activeTab === 'css') return this.generatedCss;
    return this.generatedTs;
  }

  // --- Angular Builders ---
  private buildAngularHtml(elements: FormElement[]): string {
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

  private buildAngularTs(elements: FormElement[]): string {
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

  // --- Vanilla Builders ---
  private buildVanillaHtml(elements: FormElement[]): string {
    const lines: string[] = [];
    lines.push('<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Form</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <form id="myForm" class="form-container">');
    for (const el of elements) {
      const name = this.toControlName(el.label, el.id);
      const req = el.required ? ' required' : '';
      const placeholder = el.placeholder ? ` placeholder="${this.escapeAttr(el.placeholder)}"` : '';

      if (el.type === 'heading') {
        lines.push(`    <h2 class="form-heading">${this.escapeHtml(el.label)}</h2>`);
      } else if (el.type === 'divider') {
        lines.push(`    <hr class="form-divider" />`);
      } else if (el.type === 'button') {
        lines.push(`    <button type="submit" class="form-btn">${this.escapeHtml(el.label)}</button>`);
      } else if (el.type === 'textarea') {
        lines.push(`    <div class="form-group">\n      <label for="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>\n      <textarea id="${name}" name="${name}"${placeholder}${req}></textarea>`);
        if (el.helpText) lines.push(`      <small>${this.escapeHtml(el.helpText)}</small>`);
        lines.push(`    </div>`);
      } else if (el.type === 'checkbox') {
        lines.push(`    <div class="form-group form-check">\n      <input type="checkbox" id="${name}" name="${name}"${req}>\n      <label for="${name}">${this.escapeHtml(el.label)}</label>\n    </div>`);
      } else if (el.type === 'radio') {
        lines.push(`    <div class="form-group">\n      <label>${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>`);
        for (const opt of el.options ?? []) {
          const oid = `${name}_${opt.value}`;
          lines.push(`      <div class="radio-option"><input type="radio" id="${oid}" name="${name}" value="${this.escapeAttr(opt.value)}"${req}> <label for="${oid}">${this.escapeHtml(opt.label)}</label></div>`);
        }
        lines.push(`    </div>`);
      } else if (el.type === 'select') {
        lines.push(`    <div class="form-group">\n      <label for="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>\n      <select id="${name}" name="${name}"${req}>\n        <option value="">Select an option</option>`);
        for (const opt of el.options ?? []) lines.push(`        <option value="${this.escapeAttr(opt.value)}">${this.escapeHtml(opt.label)}</option>`);
        lines.push(`      </select>\n    </div>`);
      } else {
        lines.push(`    <div class="form-group">\n      <label for="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span class="req">*</span>' : ''}</label>\n      <input type="${el.type}" id="${name}" name="${name}"${placeholder}${req}>`);
        if (el.helpText) lines.push(`      <small>${this.escapeHtml(el.helpText)}</small>`);
        lines.push(`    </div>`);
      }
    }
    lines.push('  </form>\n  <script src="script.js"></script>\n</body>\n</html>');
    return lines.join('\n');
  }

  private buildVanillaJs(elements: FormElement[]): string {
    return `document.getElementById('myForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  
  // Handle checkboxes specially if needed, as unchecked boxes aren't included in FormData
  console.log('Form submitted:', data);
});`;
  }

  // --- React Builders ---
  private buildReactJsx(elements: FormElement[]): string {
    const lines: string[] = [];
    lines.push(`import React, { useState } from 'react';\nimport './styles.css';\n\nexport default function MyForm() {`);
    
    lines.push(`  const [formData, setFormData] = useState({`);
    elements.filter(el => !['heading', 'divider'].includes(el.type)).forEach(el => {
      const name = this.toControlName(el.label, el.id);
      lines.push(`    ${name}: ${el.type === 'checkbox' ? 'false' : "''"},`);
    });
    lines.push(`  });\n`);

    lines.push(`  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };\n`);

    lines.push(`  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };\n`);

    lines.push(`  return (\n    <form onSubmit={handleSubmit} className="form-container">`);

    for (const el of elements) {
      const name = this.toControlName(el.label, el.id);
      const req = el.required ? ' required' : '';
      const placeholder = el.placeholder ? ` placeholder="${this.escapeAttr(el.placeholder)}"` : '';

      if (el.type === 'heading') {
        lines.push(`      <h2 className="form-heading">${this.escapeHtml(el.label)}</h2>`);
      } else if (el.type === 'divider') {
        lines.push(`      <hr className="form-divider" />`);
      } else if (el.type === 'button') {
        lines.push(`      <button type="submit" className="form-btn">${this.escapeHtml(el.label)}</button>`);
      } else if (el.type === 'textarea') {
        lines.push(`      <div className="form-group">\n        <label htmlFor="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span className="req">*</span>' : ''}</label>\n        <textarea id="${name}" name="${name}" value={formData.${name}} onChange={handleChange}${placeholder}${req} />`);
        if (el.helpText) lines.push(`        <small>${this.escapeHtml(el.helpText)}</small>`);
        lines.push(`      </div>`);
      } else if (el.type === 'checkbox') {
        lines.push(`      <div className="form-group form-check">\n        <input type="checkbox" id="${name}" name="${name}" checked={formData.${name}} onChange={handleChange}${req} />\n        <label htmlFor="${name}">${this.escapeHtml(el.label)}</label>\n      </div>`);
      } else if (el.type === 'radio') {
        lines.push(`      <div className="form-group">\n        <label>${this.escapeHtml(el.label)}${el.required ? ' <span className="req">*</span>' : ''}</label>`);
        for (const opt of el.options ?? []) {
          const oid = `${name}_${opt.value}`;
          lines.push(`        <div className="radio-option"><input type="radio" id="${oid}" name="${name}" value="${this.escapeAttr(opt.value)}" checked={formData.${name} === "${this.escapeAttr(opt.value)}"} onChange={handleChange}${req} /> <label htmlFor="${oid}">${this.escapeHtml(opt.label)}</label></div>`);
        }
        lines.push(`      </div>`);
      } else if (el.type === 'select') {
        lines.push(`      <div className="form-group">\n        <label htmlFor="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span className="req">*</span>' : ''}</label>\n        <select id="${name}" name="${name}" value={formData.${name}} onChange={handleChange}${req}>\n          <option value="">Select an option</option>`);
        for (const opt of el.options ?? []) lines.push(`          <option value="${this.escapeAttr(opt.value)}">${this.escapeHtml(opt.label)}</option>`);
        lines.push(`        </select>\n      </div>`);
      } else {
        lines.push(`      <div className="form-group">\n        <label htmlFor="${name}">${this.escapeHtml(el.label)}${el.required ? ' <span className="req">*</span>' : ''}</label>\n        <input type="${el.type}" id="${name}" name="${name}" value={formData.${name}} onChange={handleChange}${placeholder}${req} />`);
        if (el.helpText) lines.push(`        <small>${this.escapeHtml(el.helpText)}</small>`);
        lines.push(`      </div>`);
      }
    }
    lines.push(`    </form>\n  );\n}`);
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

  async downloadFolder(): Promise<void> {
    const JSZipConstructor = JSZip as any;
    const zip = new JSZipConstructor();

    if (this.framework === 'angular') {
      const folderName = 'my-form-component';
      const folder = zip.folder(folderName);
      if (folder) {
        folder.file('my-form.component.html', this.generatedCode);
        folder.file('my-form.component.css', this.generatedCss);
        folder.file('my-form.component.ts', this.generatedTs);
      }
    } else if (this.framework === 'vanilla') {
      const folderName = 'my-form-vanilla';
      const folder = zip.folder(folderName);
      if (folder) {
        folder.file('index.html', this.generatedCode);
        folder.file('styles.css', this.generatedCss);
        folder.file('script.js', this.generatedTs);
      }
    } else if (this.framework === 'react') {
      const folderName = 'my-form-react';
      const folder = zip.folder(folderName);
      if (folder) {
        folder.file('MyForm.jsx', this.generatedCode);
        folder.file('styles.css', this.generatedCss);
      }
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `form-${this.framework}-code.zip`);
    } catch (e) {
      console.error('Failed to generate zip', e);
      alert('Failed to generate zip file');
    }
  }

  closeModal() { this.showModal = false; }
}
