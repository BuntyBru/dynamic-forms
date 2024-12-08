export const dataJson = [
  {
    name: "username",
    label: "Username",
    type: "input_text",
    placeholder: "Enter your username",
    validationRules: [{ rule: "required", message: "Username is required" }],
  },
  {
    name: "age",
    label: "Age",
    type: "input_number",
    placeholder: "Enter your age",
    validationRules: [
      { rule: "required", message: "Age is required" },
      { rule: "numeric", message: "Age must be a number" },
    ],
  },
  {
    name: "password",
    label: "Password",
    type: "input_password",
    placeholder: "Enter your password",
    validationRules: [
      { rule: "required", message: "Password is required" },
      { rule: "passwordStrength", message: "Password is too weak" },
    ],
  },
  {
    name: "special_code",
    label: "Special Code",
    type: "input_special",
    placeholder: "Enter the special code",
  },
  {
    name: "gender",
    label: "Gender",
    type: "choice",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    validationRules: [{ rule: "required", message: "Please select a gender" }],
  },
  {
    name: "terms",
    label: "I agree to the terms and conditions",
    type: "checkbox",
    validationRules: [
      { rule: "required", message: "You must accept the terms" },
    ],
  },
  {
    name: "comments",
    label: "Comments",
    type: "textarea",
    placeholder: "Write your comments here...",
    validationRules: [
      {
        rule: "maxLength",
        value: 250,
        message: "Maximum 250 characters allowed",
      },
    ],
  },
];

export const dataJson2 = [
  {
    name: "username",
    label: "Username",
    type: "input_text",
    placeholder: "Enter your username",
    validationRules: [{ rule: "required", message: "Username is required" }],
  },
  {
    name: "email",
    label: "Email",
    type: "input_text",
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
    type: "input_text",
    filter: "numeric",
    validationRules: [{ rule: "required", message: "Age is required" }],
  },
  {
    name: "bio",
    label: "Bio",
    type: "input_text",
    placeholder: "Tell us about yourself",
    validationRules: [],
    renderIf: "hasUserName",
  },
];
