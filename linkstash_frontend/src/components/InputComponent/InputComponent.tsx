import React, { ChangeEvent } from "react";

import { InputConfig } from './types'
import styles from "./InputComponent.module.css";

export default function InputComponent(
  config: InputConfig = {
    type: "text",
    id: "",
    name: "",
    label: "",
    value: "",
    disabled: false,
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
    labelWidth,
    value,
    disabled,
    handleChange,
    required,
    autocomplete,
    autofocus,
    placeholder,
    pattern
  } = config;

  const labelClassName = labelWidth?"inline-block m-2 w-100": "inline-block m-2 w-100"
  const labelProperties = {
    className : labelClassName
  }
  //w-[".concat(labelWidth?.toString()).concat("px]

  // if(!handleOnInvalid) 

  if(type==="textarea")  return (
    <label className={styles["form-label"]}>
    <span className="inline-block m-2 w-[90px]">{label}{" "}</span>
    <textarea      
      name={name}        
      autoFocus={autofocus}
      autoComplete={autocomplete}
      placeholder={placeholder}
      className={styles["form-input"].concat(" form-input")}
      required={required}
      id={id}
      onChange={handleChange}
      disabled= {disabled }
      value={value}
      
    />
  </label>);

  return (
    <>
    <label className={styles["form-label"]} >
      <span className="inline-block m-2 w-[90px]">{label}{" "}</span>
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
        disabled= {disabled }
        value={value}
        pattern={pattern}
        // onInvalid={e=>(e.target as HTMLInputElement).setCustomValidity('arroooooo')}
       
      />
    </label>
    </>
  );
  
}