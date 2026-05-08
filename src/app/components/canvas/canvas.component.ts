import { Component } from '@angular/core';
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
  constructor(public formService: FormBuilderService) {}

  onDrop(event: CdkDragDrop<FormElement[]>): void {
    if (event.previousContainer === event.container) {
      this.formService.moveElement(event.previousIndex, event.currentIndex);
      return;
    }

    const droppedType: string = event.item.data;
    this.formService.addElement(droppedType, event.currentIndex);
  }

  updateLabel(id: number, label: string): void {
    this.formService.updateElement(id, { label });
  }

  updatePlaceholder(id: number, placeholder: string): void {
    this.formService.updateElement(id, { placeholder });
  }

  updateRequired(id: number, required: boolean): void {
    this.formService.updateElement(id, { required });
  }

  updateOptions(id: number, optionsText: string): void {
    this.formService.updateElementOptions(id, optionsText);
  }

  getOptionsText(element: FormElement): string {
    return element.options?.map((option) => option.label).join('\n') ?? '';
  }

  hasPlaceholder(element: FormElement): boolean {
    return ['text', 'textarea', 'email', 'number', 'password'].includes(
      element.type,
    );
  }

  hasOptions(element: FormElement): boolean {
    return ['radio', 'select'].includes(element.type);
  }

  duplicateElement(id: number): void {
    this.formService.duplicateElement(id);
  }

  moveElement(id: number, direction: -1 | 1): void {
    this.formService.moveElementById(id, direction);
  }

  deleteElement(id: number): void {
    this.formService.removeElement(id);
  }

  clearAll(): void {
    this.formService.clearAll();
  }
}
