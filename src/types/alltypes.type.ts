export type SubmitResult = {
  valid: boolean;
  data: Record<string, any>;
  errors: Record<string, any>;
};

export interface ValidationRule {
  rule: string | ((value: any) => boolean);
  message?: string;
}

export interface InputConfig {
  name: string;
  label?: string;
  placeholder?: string;
  validationRules?: ValidationRule[];
  filter?: string | ((value: string) => boolean);
  transformer?: string | ((value: string) => string);
  renderIf?: (form: Record<string, any>) => boolean;
  autocomplete?: boolean;
}

export interface SubmitButtonConfig {
  text: string;
  className?: string;
}

export interface DynamicFormBuilderProps {
  defaultValues?: Record<string, any>;
  inputs: InputConfig[];
  onChange?: (data: { valid: boolean; data: Record<string, any> }) => void;
  onSubmit?: (data: {
    valid: boolean;
    data: Record<string, any>;
    errors: Record<string, any>;
  }) => void;
  formErrors?: Record<string, any>;
  validationTimeout?: number;
  submitButton?: SubmitButtonConfig;
  classPrefix?: string;
  defaultInputClass?: string;
  invalidInputClass?: string;
  validInputClass?: string;
  defaultLabelClass?: string;
  defaultValidationErrorClass?: string;
  defaultContainerClass?: string;
}
