import { useState, useEffect } from "react";
import {
  ValidationRule,
  InputConfig,
  DynamicFormBuilderProps,
} from "../../types/alltypes.type";
import "./dynamicFormbuilderstyle.scss";

const getFormDataFromJSON = (jsonObjArray: InputConfig[]) => {
  const derivedObject: Record<string, string> = jsonObjArray.reduce(
    (acc: Record<string, string>, item: InputConfig) => {
      acc[item.name] = "";
      return acc;
    },
    {}
  );

  return derivedObject;
};

const DynamicFormBuilder = ({
  data,
  onChange,
  onSubmit,
  submitButton,
  logicMap,
}: DynamicFormBuilderProps) => {
  const [form, setForm] = useState<Record<string, any>>({});
  const [inputs, setInputs] = useState<InputConfig[]>([]);
  const [canRender, setCanRender] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    setInputs(JSON.parse(data));
    getFormDataFromJSON(JSON.parse(data));
  }, [data]);

  useEffect(() => {
    const renderableInputs = inputs.filter((input) => {
      if (input.renderIf) {
        let x = input?.renderIf as unknown as string;
        return logicMap?.[x](form);
      }
      return true;
    });
    setCanRender(renderableInputs.map((input) => input.name));
  }, [inputs, form]);

  const filterRules: Record<string, (value: string) => boolean> = {
    numeric: (value) => /^$|^[0-9]+$/.test(value),
    decimal: (value) => /^$|^[\d.]+$/.test(value),
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

  const handleSubmit = () => {
    const [valid, errors] = validateForm();
    onSubmit && onSubmit({ valid, data: form, errors });
  };

  const validateForm = (
    fullValidation = true
  ): [boolean, Record<string, any>] => {
    let valid = true;
    let newErrors: Record<string, any> = {};

    inputs.forEach(({ name, validationRules: rules }) => {
      if (
        rules &&
        (!fullValidation || !validateInput(name, form[name], rules))
      ) {
        valid = false;
        newErrors[name] = validationErrors[name];
      }
    });

    return [valid, newErrors];
  };

  const applyFilter = (
    value: string,
    filter: string | ((value: string) => boolean)
  ) => {
    if (typeof filter === "function") return filter(value);
    if (typeof filter === "string") return filterRules[filter]?.(value);
    return true;
  };

  return (
    <div className="formParent">
      {inputs
        .filter((input) => canRender.includes(input.name))
        .map((input, index) => (
          <div key={index} className="formParent__inputBox">
            <label htmlFor={input.name}>{input.label}</label>
            <input
              name={input.name}
              value={form[input.name] || ""}
              onChange={(e) => handleInput(input, e)}
              placeholder={input.placeholder}
              className={
                validationErrors[input.name] ? "formParent__invalidInput" : ""
              }
            />
            {validationErrors[input.name] && (
              <p className="errorMessage">{validationErrors[input.name]}</p>
            )}
          </div>
        ))}
      {submitButton && (
        <button onClick={handleSubmit}>{submitButton.text}</button>
      )}
    </div>
  );
};

export default DynamicFormBuilder;
