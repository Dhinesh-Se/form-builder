import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormElement } from '../../models/form-element.model';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDrag, CdkDropList],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent {
  expandedId = signal<number | null>(null);

  constructor(public formService: FormBuilderService) {}

  get theme() { return this.formService.theme(); }

  onDrop(event: CdkDragDrop<FormElement[]>): void {
    if (event.previousContainer === event.container) {
      this.formService.moveElement(event.previousIndex, event.currentIndex);
      return;
    }
    const droppedType: string = event.item.data;
    this.formService.addElement(droppedType, event.currentIndex);
  }

  toggleExpand(id: number) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  updateLabel(id: number, label: string) { this.formService.updateElement(id, { label }); }
  updatePlaceholder(id: number, placeholder: string) { this.formService.updateElement(id, { placeholder }); }
  updateRequired(id: number, required: boolean) { this.formService.updateElement(id, { required }); }
  updateHelpText(id: number, helpText: string) { this.formService.updateElement(id, { helpText }); }
  updateWidth(id: number, width: 'full' | 'half' | 'third') { this.formService.updateElement(id, { width }); }
  updateOptions(id: number, optionsText: string) { this.formService.updateElementOptions(id, optionsText); }

  getOptionsText(element: FormElement): string {
    return element.options?.map((option) => option.label).join('\n') ?? '';
  }

  hasPlaceholder(element: FormElement): boolean {
    return ['text', 'textarea', 'email', 'number', 'password', 'tel', 'url'].includes(element.type);
  }

  hasOptions(element: FormElement): boolean {
    return ['radio', 'select'].includes(element.type);
  }

  isLayoutType(element: FormElement): boolean {
    return ['heading', 'divider'].includes(element.type);
  }

  duplicateElement(id: number) { this.formService.duplicateElement(id); }
  moveElement(id: number, direction: -1 | 1) { this.formService.moveElementById(id, direction); }
  deleteElement(id: number) {
    if (this.expandedId() === id) this.expandedId.set(null);
    this.formService.removeElement(id);
  }
  clearAll() {
    this.expandedId.set(null);
    this.formService.clearAll();
  }

  trackByElement(index: number, el: FormElement): number {
    return el.id;
  }

  getShadowStyle(level: string): string {
    const map: Record<string, string> = {
      none: 'none',
      sm: '0 1px 3px rgba(0,0,0,0.08)',
      md: '0 4px 12px rgba(0,0,0,0.1)',
      lg: '0 8px 24px rgba(0,0,0,0.12)',
    };
    return map[level] ?? 'none';
  }
}
