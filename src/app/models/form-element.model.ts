export interface FormElementOption {
  label: string;
  value: string;
}

export interface FormElementDefinition {
  type: string;
  label: string;
  placeholder?: string;
  options?: FormElementOption[];
}

export interface FormElement extends FormElementDefinition {
  id: number;
  required: boolean;
}
