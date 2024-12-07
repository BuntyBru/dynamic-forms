import React, { useState, useEffect } from "react";
import {
  ValidationRule,
  InputConfig,
  DynamicFormBuilderProps,
} from "../../types/alltypes.type";

const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({
  defaultValues = {},
  inputs: initialInputs,
  onChange,
  onSubmit,
  validationTimeout = 500,
  submitButton,
  classPrefix = "dynamic-form",
  defaultInputClass = "input",
  invalidInputClass = "invalid",
  validInputClass = "valid",
  defaultLabelClass = "label",
  defaultValidationErrorClass = "error",
  defaultContainerClass = "container",
}) => {
  const [form, setForm] = useState<Record<string, any>>({ ...defaultValues });
  const [inputs, setInputs] = useState<InputConfig[]>([...initialInputs]);
  const [canRender, setCanRender] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>(
    {}
  );
  const [randomisedFields, setRandomisedFields] = useState<
    Record<string, string>
  >({});

  console.log("hello ", inputs);

  const filterRules: Record<string, (value: string) => boolean> = {
    numeric: (value) => /^$|^[0-9]+$/.test(value),
    decimal: (value) => /^$|^[\d.]+$/.test(value),
  };

  const transformerRules: Record<string, (value: string) => string> = {
    uppercase: (value) => value.toUpperCase(),
    lowercase: (value) => value.toLowerCase(),
  };

  const validationRules: Record<string, (value: any) => boolean> = {
    required: (value) => {
      if (typeof value === "object") value = Object.keys(value);
      return typeof value === "string" || Array.isArray(value)
        ? !!value.length
        : value !== null && value !== undefined;
    },
    email: (value) =>
      !value ||
      /^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      ),
    decimal: (value) => !value || /^$|^\d+$|^\.\d+|^\d+\.\d+$/.test(value),
  };

  useEffect(() => {
    const flatInputs = inputs.flat(Infinity);
    const newRandomisedFields = { ...randomisedFields };
    const newForm = { ...form };
    const newValidationErrors = { ...validationErrors };
    const renderableFields: string[] = [];

    flatInputs.forEach(({ name, renderIf, autocomplete }) => {
      if (typeof renderIf === "function" && !renderIf(form)) {
        delete newForm[name];
        delete newValidationErrors[name];
      } else {
        renderableFields.push(name);
      }

      if (autocomplete === false && !newRandomisedFields[name]) {
        newRandomisedFields[name] = Math.random().toString(36).substring(7);
      } else {
        delete newRandomisedFields[name];
      }
    });

    setRandomisedFields((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newRandomisedFields)) {
        return newRandomisedFields;
      }
      return prev;
    });

    setForm((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newForm)) {
        return newForm;
      }
      return prev;
    });

    setValidationErrors((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newValidationErrors)) {
        return newValidationErrors;
      }
      return prev;
    });

    setCanRender(renderableFields);
  }, [inputs, form, randomisedFields]);

  const handleInput = (
    input: InputConfig,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, validationRules: rules, filter } = input;
    const value = event.target.value;

    if (filter && !applyFilter(value, filter)) return;

    const newForm = { ...form, [name]: value };
    setForm(newForm);

    if (rules) {
      validateInput(name, value, rules);
    }

    onChange && onChange({ valid: validateForm(false)[0], data: newForm });
  };

  const applyFilter = (
    value: string,
    filter: string | ((value: string) => boolean)
  ) => {
    if (typeof filter === "function") return filter(value);
    if (typeof filter === "string") return filterRules[filter]?.(value);
    return true;
  };

  const validateInput = (name: string, value: any, rules: ValidationRule[]) => {
    let valid = true;
    let errorMessage: string | null = null;

    rules.forEach((rule) => {
      if (typeof rule.rule === "function" && !rule.rule(value)) {
        valid = false;
        errorMessage = rule.message || null;
      } else if (
        typeof rule.rule === "string" &&
        !validationRules[rule.rule]?.(value)
      ) {
        valid = false;
        errorMessage = rule.message || null;
      }
    });

    setValidationErrors((prev) => ({
      ...prev,
      [name]: !valid ? errorMessage || true : false,
    }));

    return valid;
  };

  const validateForm = (
    fullValidation = true
  ): [boolean, Record<string, any>] => {
    let valid = true;
    let newErrors: Record<string, any> = {};

    inputs.flat(Infinity).forEach(({ name, validationRules: rules }) => {
      if (
        rules &&
        (!fullValidation || !validateInput(name, form[name], rules))
      ) {
        valid = false;
        newErrors[name] = validationErrors[name];
      }
    });

    setValidationErrors(newErrors);
    return [valid, newErrors];
  };

  const handleSubmit = () => {
    const [valid, errors] = validateForm();
    onSubmit && onSubmit({ valid, data: form, errors });
  };

  return (
    <div className="">
      {inputs.map((input, index) => (
        <div key={index} className={`${classPrefix}-${defaultContainerClass}`}>
          <label
            htmlFor={input.name}
            className={`${classPrefix}-${defaultLabelClass}`}
          >
            {input.label}
          </label>
          <input
            name={input.name}
            value={form[input.name] || ""}
            onChange={(e) => handleInput(input, e)}
            placeholder={input.placeholder}
            className={`${classPrefix}-${defaultInputClass}`}
          />
          {validationErrors[input.name] && (
            <p className={`${classPrefix}-${defaultValidationErrorClass}`}>
              {validationErrors[input.name]}
            </p>
          )}
        </div>
      ))}
      {submitButton && (
        <button onClick={handleSubmit} className={`${classPrefix}-submit`}>
          {submitButton.text}
        </button>
      )}
    </div>
  );
};

export default DynamicFormBuilder;
