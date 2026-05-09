import { FormElementDefinition } from '../models/form-element.model';

export const COMPONENT_DEFINITIONS: FormElementDefinition[] = [
  { type: 'text', label: 'Text Input', icon: 'T', category: 'Basic', placeholder: 'Enter text' },
  { type: 'textarea', label: 'Text Area', icon: '¶', category: 'Basic', placeholder: 'Enter text...' },
  { type: 'email', label: 'Email', icon: '@', category: 'Basic', placeholder: 'you@example.com' },
  { type: 'number', label: 'Number', icon: '#', category: 'Basic', placeholder: '0' },
  { type: 'password', label: 'Password', icon: '🔒', category: 'Basic', placeholder: '••••••••' },
  { type: 'tel', label: 'Phone', icon: '📞', category: 'Basic', placeholder: '+1 (555) 000-0000' },
  { type: 'url', label: 'Website URL', icon: '🔗', category: 'Basic', placeholder: 'https://' },
  { type: 'date', label: 'Date', icon: '📅', category: 'Date & Time' },
  { type: 'time', label: 'Time', icon: '⏰', category: 'Date & Time' },
  { type: 'datetime-local', label: 'Date & Time', icon: '🗓️', category: 'Date & Time' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑', category: 'Choice' },
  {
    type: 'radio',
    label: 'Radio Group',
    icon: '◉',
    category: 'Choice',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: '▾',
    category: 'Choice',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  { type: 'range', label: 'Slider', icon: '⟺', category: 'Advanced' },
  { type: 'color', label: 'Color Picker', icon: '🎨', category: 'Advanced' },
  { type: 'file', label: 'File Upload', icon: '📎', category: 'Advanced' },
  { type: 'heading', label: 'Heading', icon: 'H', category: 'Layout' },
  { type: 'divider', label: 'Divider', icon: '—', category: 'Layout' },
  { type: 'button', label: 'Submit Button', icon: '▶', category: 'Action' },
];
