export interface FormElementOption {
  label: string;
  value: string;
}

export interface FormElementDefinition {
  type: string;
  label: string;
  icon: string;
  category: string;
  placeholder?: string;
  options?: FormElementOption[];
}

export interface FormElement extends FormElementDefinition {
  id: number;
  required: boolean;
  helpText?: string;
  width?: 'full' | 'half' | 'third';
}

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: string;
  fontFamily: string;
  fontSize: string;
  spacing: string;
  labelColor: string;
  inputBg: string;
  buttonTextColor: string;
  shadowLevel: 'none' | 'sm' | 'md' | 'lg';
}

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#6366f1',
  backgroundColor: '#f8fafc',
  surfaceColor: '#ffffff',
  textColor: '#1e293b',
  borderColor: '#e2e8f0',
  borderRadius: '8px',
  fontFamily: "'Inter', sans-serif",
  fontSize: '14px',
  spacing: '16px',
  labelColor: '#374151',
  inputBg: '#ffffff',
  buttonTextColor: '#ffffff',
  shadowLevel: 'sm',
};

export const PRESET_THEMES: { name: string; theme: ThemeConfig }[] = [
  { name: 'Indigo', theme: { ...DEFAULT_THEME, primaryColor: '#6366f1' } },
  { name: 'Rose', theme: { ...DEFAULT_THEME, primaryColor: '#f43f5e', backgroundColor: '#fff1f2' } },
  { name: 'Emerald', theme: { ...DEFAULT_THEME, primaryColor: '#10b981', backgroundColor: '#f0fdf4' } },
  { name: 'Amber', theme: { ...DEFAULT_THEME, primaryColor: '#f59e0b', backgroundColor: '#fffbeb' } },
  { name: 'Sky', theme: { ...DEFAULT_THEME, primaryColor: '#0ea5e9', backgroundColor: '#f0f9ff' } },
  {
    name: 'Dark',
    theme: {
      ...DEFAULT_THEME,
      primaryColor: '#818cf8',
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      textColor: '#f1f5f9',
      borderColor: '#334155',
      labelColor: '#cbd5e1',
      inputBg: '#0f172a',
      buttonTextColor: '#ffffff',
    },
  },
];
