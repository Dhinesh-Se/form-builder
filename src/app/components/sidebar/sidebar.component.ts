import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(public formService: FormBuilderService) {}
}
