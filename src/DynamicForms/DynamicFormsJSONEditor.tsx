import React, { useState, ChangeEvent, useEffect } from "react";
import DynamicFormBuilder from "./DynamicFormBuilder";

type SubmitResult = {
  valid: boolean;
  data: Record<string, any>;
  errors: Record<string, any>;
};

const DynamicFormWithJSONEditor: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [formInputsJson, setFormInputsJson] = useState<string>(
    JSON.stringify(
      [
        {
          name: "username",
          label: "Username",
          placeholder: "Enter your username",
          validationRules: [
            { rule: "required", message: "Username is required" },
          ],
        },
        {
          name: "email",
          label: "Email",
          placeholder: "Enter your email",
          validationRules: [
            { rule: "required", message: "Email is required" },
            { rule: "email", message: "Enter a valid email address" },
          ],
        },
        {
          name: "age",
          label: "Age",
          placeholder: "Enter your age",
          filter: "numeric",
          validationRules: [{ rule: "required", message: "Age is required" }],
        },
        {
          name: "bio",
          label: "Bio",
          placeholder: "Tell us about yourself",
          validationRules: [],
          renderIf: (form: Record<string, any>) => !!form.username,
        },
      ],
      null,
      2
    )
  );

  const handleInputsJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormInputsJson(event.target.value);
  };

  useEffect(() => {
    console.log("Change", formInputsJson);
  }, [formInputsJson]);

  const handleChange = (data: {
    valid: boolean;
    data: Record<string, any>;
  }) => {
    setFormData(data.data);
    console.log("Form Data Updated:", data);
  };

  const handleSubmit = (data: SubmitResult) => {
    console.log("Form Submission Result:", data);
    setSubmitResult(data);
  };

  const renderForm = () => {
    try {
      const inputs = JSON.parse(formInputsJson);
      return (
        <DynamicFormBuilder
          defaultValues={{ username: "", email: "", age: "" }}
          inputs={inputs}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitButton={{ text: "Submit" }}
          classPrefix="custom-form"
          defaultInputClass="custom-input"
          defaultLabelClass="custom-label"
          defaultValidationErrorClass="custom-error"
          defaultContainerClass="custom-container"
        />
      );
    } catch (error) {
      return <p>Invalid JSON format. Please correct it to render the form.</p>;
    }
  };

  return (
    <div>
      <h1>JSON Form Editor</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h2>Edit Form JSON</h2>
          <textarea
            style={{ fontFamily: "monospace", width: "100%", height: "300px" }}
            value={formInputsJson}
            onChange={handleInputsJsonChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2>Dynamic Form</h2>
          {renderForm()}
        </div>
      </div>
      <div>
        <h2>Form Data</h2>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
        <h2>Submission Result</h2>
        <pre>{JSON.stringify(submitResult, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DynamicFormWithJSONEditor;
