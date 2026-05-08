import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, CdkDropList],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent {
  constructor(public formService: FormBuilderService) {}

  onDrop(event: CdkDragDrop<any[]>): void {
    // Only add element when dropped FROM the sidebar (not reordering within canvas)
    if (event.previousContainer !== event.container) {
      // event.item.data is the type string set by [cdkDragData] in the sidebar
      const droppedType: string = event.item.data;
      this.formService.addElement(droppedType);
    }
  }

  deleteElement(id: number): void {
    this.formService.removeElement(id);
  }

  clearAll(): void {
    this.formService.clearAll();
  }
}
