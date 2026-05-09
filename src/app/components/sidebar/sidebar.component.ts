import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormBuilderService } from '../../services/form-builder.service';
import { ThemeConfig, PRESET_THEMES } from '../../models/form-element.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDrag, CdkDropList],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  activeTab = signal<'fields' | 'theme'>('fields');
  presets = PRESET_THEMES;
  searchQuery = signal<string>('');

  constructor(public formService: FormBuilderService) {}

  get filteredCategories(): string[] {
    if (!this.searchQuery()) return this.formService.categories;
    return this.formService.categories.filter((cat) =>
      this.formService.getByCategory(cat).some((d) =>
        d.label.toLowerCase().includes(this.searchQuery().toLowerCase())
      )
    );
  }

  getFilteredByCategory(category: string) {
    if (!this.searchQuery()) return this.formService.getByCategory(category);
    return this.formService
      .getByCategory(category)
      .filter((d) => d.label.toLowerCase().includes(this.searchQuery().toLowerCase()));
  }

  updateThemeColor(key: keyof ThemeConfig, value: string) {
    this.formService.updateTheme({ [key]: value } as Partial<ThemeConfig>);
  }

  applyPreset(preset: ThemeConfig) {
    this.formService.applyPreset(preset);
  }

  get theme() {
    return this.formService.theme();
  }
}
