import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CodeModalComponent } from './components/code-modal/code-modal.component';
import { PreviewComponent } from './components/preview/preview.component';
import { FormBuilderService } from './services/form-builder.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, SidebarComponent, CanvasComponent, CodeModalComponent, PreviewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public formService: FormBuilderService) {}
}
