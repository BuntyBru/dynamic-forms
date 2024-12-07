import React, { useState, ChangeEvent, useEffect } from "react";
import DynamicFormBuilder from "../DynamicFormBuilder/DynamicFormBuilder";
import "./jsoneditor.scss";
import { SubmitResult } from "../../types/alltypes.type";

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
    const newJson = event.target.value;
    try {
      JSON.parse(newJson);
      setFormInputsJson(newJson);
    } catch (error) {
      alert("Invalid JSON format! Please fix the errors.");
    }
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
      return (
        <DynamicFormBuilder
          defaultValues={{ username: "", email: "", age: "" }}
          inputs={JSON.parse(formInputsJson)}
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
    <div className="jsonEditorContainer">
      <h1>JSON Form Editor</h1>
      <div className="jsonEditorContainer__textAreaContainer">
        <div className="jsonEditorContainer__editorSection">
          <h2>Edit Form JSON</h2>
          <textarea
            className="jsonEditorContainer__textArea"
            value={formInputsJson}
            onChange={handleInputsJsonChange}
          />
        </div>
        <div className="jsonEditorContainer__renderSection">
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
