import React, { useState, useEffect } from "react";
import DynamicFormBuilder from "../DynamicFormBuilder/DynamicFormBuilder";
import "./jsoneditor.scss";
import { SubmitResult, InputConfig } from "../../types/alltypes.type";
import MonacoEditor from "@monaco-editor/react";

const DynamicFormWithJSONEditor: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [formInputsJson, setFormInputsJson] = useState<string>(
    JSON.stringify([], null, 2)
  );
  const [parsedInputs, setParsedInputs] = useState<InputConfig[]>([]); // Type changed to InputConfig[]

  const handleEditorChange = (value: string | undefined) => {
    try {
      setError(false);
      const newJson = value || "";
      JSON.parse(newJson);
      setFormInputsJson(newJson);
    } catch (error) {
      setError(true);
      console.error("Invalid JSON format:");
    }
  };

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

  const handleSubmitJSON = () => {
    if (!error) {
      try {
        const parsed = JSON.parse(formInputsJson);
        setParsedInputs(parsed);
        console.log(parsed);
      } catch (error) {
        setParsedInputs([]);
      }
    }
  };

  return (
    <div className="jsonEditorContainer">
      <h1>JSON Form Editor</h1>
      <div className="jsonEditorContainer__textAreaContainer">
        <div className="jsonEditorContainer__editorSection">
          <h2>Edit Form JSON</h2>
          <div style={{ height: "500px", marginBottom: "20px" }}>
            <MonacoEditor
              height="100%"
              defaultLanguage="json"
              value={formInputsJson}
              onChange={handleEditorChange}
              options={{
                theme: "vs-dark",
                automaticLayout: true,
                minimap: { enabled: false },
                formatOnPaste: true,
                formatOnType: true,
              }}
            />

            <button onClick={handleSubmitJSON}>Submit JSON</button>
          </div>
        </div>
        <div className="jsonEditorContainer__renderSection">
          <h2>Dynamic Form</h2>
          {error ? (
            <p>JSON Invalid</p>
          ) : (
            <DynamicFormBuilder
              key={JSON.stringify(parsedInputs)}
              defaultValues={{ username: "", email: "", age: "" }}
              inputs={parsedInputs}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitButton={{ text: "Submit" }}
              classPrefix="custom-form"
              defaultInputClass="custom-input"
              defaultLabelClass="custom-label"
              defaultValidationErrorClass="custom-error"
              defaultContainerClass="custom-container"
            />
          )}
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

/*
 {
          "name": "username",
          "label": "Username",
          "placeholder": "Enter your username",
          "validationRules": [
            { "rule": "required", "message": "Username is required" }
          ]
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
        }*/
