import { Component } from '@angular/core';
import { CdkDropListGroup } from '@angular/cdk/drag-drop'; // 👈 add this
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CodeModalComponent } from './components/code-modal/code-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CdkDropListGroup, // 👈 add this
    SidebarComponent,
    CanvasComponent,
    CodeModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
