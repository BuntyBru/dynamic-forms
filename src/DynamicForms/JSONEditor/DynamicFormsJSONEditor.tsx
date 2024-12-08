import React, { useState } from "react";
import "./jsoneditor.scss";
import { SubmitResult } from "../../types/alltypes.type";
import MonacoEditor from "@monaco-editor/react";
import _ from "lodash";
import DynamicFormBuilder from "../DynamicFormBuilder/DynamicFormBuilder";

const OPTIONS_EDITOR = {
  theme: "vs-dark",
  automaticLayout: true,
  minimap: { enabled: false },
  formatOnPaste: true,
  formatOnType: true,
};

const DynamicFormWithJSONEditor: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<boolean>(false);
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
          renderIf: "hasUserName",
        },
      ],
      null,
      2
    )
  );

  const logicMap = {
    hasUserName: (form: Record<string, any>) => !!form.username,
  };

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
  };

  const handleSubmit = (data: SubmitResult) => {
    console.log("Form Submission Result:", data);
    setSubmitResult(data);
  };
  console.log("formInputsJson", formInputsJson);
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
              options={OPTIONS_EDITOR}
            />
          </div>
        </div>
        <div className="jsonEditorContainer__renderSection">
          <h2>Dynamic Form</h2>
          {error ? (
            <p>JSON Invalid</p>
          ) : (
            <>
              <DynamicFormBuilder
                data={formInputsJson}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitButton={{ text: "Save and Continue" }}
                logicMap={logicMap}
              />
            </>
          )}
        </div>
      </div>
      <div className="jsonEditorContainer__submissionSection">
        <div className="jsonEditorContainer__formDataPart">
          <h2>Form Data</h2>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>

        <div className="jsonEditorContainer__resultPart">
          <h2>Submission Result</h2>
          <pre>{JSON.stringify(submitResult, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormWithJSONEditor;
