import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent {
  constructor(public formService: FormBuilderService) {}

  get theme() { return this.formService.theme(); }

  getShadowStyle(level: string): string {
    const map: Record<string, string> = {
      none: 'none',
      sm: '0 2px 8px rgba(0,0,0,0.08)',
      md: '0 4px 20px rgba(0,0,0,0.12)',
      lg: '0 8px 40px rgba(0,0,0,0.16)',
    };
    return map[level] ?? 'none';
  }

  close() {
    this.formService.previewMode.set(false);
  }
}
