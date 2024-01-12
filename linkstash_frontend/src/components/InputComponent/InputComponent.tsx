import React, { ChangeEvent } from "react";
import styles from "./InputComponent.module.css";

type InputComponentType = "text" | "password";

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete */
type AutocompleteType =
  | "off"
  | "on"
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  | "email"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "organization-title"
  | "organization"
  | "street-address"
  | "shipping"
  | "billing"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-extension"
  | "impp"
  | "url"
  | "photo"
  | "webauthn";

export type InputConfig = {
  type: InputComponentType;
  id: string;
  label: String;
  name: string;
  value?: string;
  enabled?: boolean;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autocomplete?: AutocompleteType;
  autofocus?: boolean;
  placeholder?: string;
  className?: string[];
  children?: React.ReactNode;
};

export default function InputComponent(
  config: InputConfig = {
    type: "text",
    id: "",
    name: "",
    label: "",
    value: "",
    enabled: true,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {},
    required: false,
    autofocus: false,
  }
) {
  const {
    type,
    id,
    name,
    label,
    value,
    enabled,
    handleChange,
    required,
    autocomplete,
    autofocus,
    placeholder,
  } = config;
  return (
    <label className={styles["form-label"]}>
      {label}{" "}
      <input
        type={type}
        name={name}        
        autoFocus={autofocus}
        autoComplete={autocomplete}
        placeholder={placeholder}
        className={styles["form-input"].concat(" form-input")}
        required={required}
        id={id}
        onChange={handleChange}
        disabled= {!enabled }
        value={value}
      />
    </label>
  );
}
