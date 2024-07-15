import { ChangeEvent, ChangeEventHandler } from "react";

/**
 *  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
 *  button, checkbox, color, date, datetime-local, email, file, hidden, image, month, number, password, radio, range, reset, search, submit, tel, text, time, url, week, 
 */
type PatternInputComponentType = "text" | "search" | "url" | "tel"| "email" | "password"
type NonInputComponentType = "textarea"
type NonTextComponentType = "button" | "checkbox" | "color" | "file" | "hidden" | "image" | "radio" | "range" | "reset" | "submit" 
type InputComponentType = PatternInputComponentType | NonInputComponentType |  NonTextComponentType | "text" | "password" | "textarea" | "email" | "number" | "search" | "tel" | "url";

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete */
export type AutocompleteType =
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

export type InputComponentChangeEventHandler = ChangeEventHandler<HTMLInputElement> | ChangeEventHandler<HTMLTextAreaElement>

export type InputConfig = {
  type: InputComponentType;
  id: string;
  label: String;
  labelWidth?: number;
  labelAuto?: boolean
  name: string;
  value?: string;
  disabled?: boolean;
  handleChange?: InputComponentChangeEventHandler ;
  required?: boolean;
  autocomplete?: AutocompleteType;
  autofocus?: boolean;
  placeholder?: string;
  className?: string[];
  pattern?: string;
  children?: React.ReactNode;
};
