import React, { ChangeEvent, ChangeEventHandler } from "react";

import { InputConfig } from './types'
import styles from "./InputComponent.module.css";


//TODO prop types
export function InputComponent(  
  config: InputConfig & ( React.HTMLProps<HTMLInputElement> & React.HTMLProps<HTMLTextAreaElement> ) = {
    type: "text",
    id: "",
    name: "",
    label: "",
    value: "",
    disabled: false,
    handleChange: ()=>{},
    required: false,
    autofocus: false,
    labelWidth: 90,
    labelAuto: false,
    defaultValue: "",
    className: "",          
  }
) {
  const {
    type,
    id,
    name,
    label,
    value,
    disabled,
    handleChange,
    required,
    autocomplete,
    autofocus,
    placeholder,
    pattern,
    labelWidth,
    labelAuto,
    defaultValue,
    className,
    ... props    
  } = config;

  
  

  if(type==="textarea") 
    { return (
    <label className={styles["form-label"]}>
    <span className="inline-block mr-2 w-[90px] align-top">{label}{" "}</span>
    <textarea
      name={name}        
      autoFocus={autofocus}
      autoComplete={autocomplete}
      placeholder={placeholder}
      className={styles["form-input"].concat(" form-input ").concat( className? className : "" )}
      required={required}
      id={id}
      onChange={(handleChange as ChangeEventHandler<HTMLTextAreaElement>)}
      disabled= {disabled }
      value={value}
      defaultValue={defaultValue}
      {...props}        
    />
  </label>);
    }
  return (
    <>
    <label className={styles["form-label"]} >
      <span style={ labelAuto? {} : {width:labelWidth?labelWidth:90}} className="inline-block mr-2">{label}{" "}</span>
      <input        
        type={type}
        name={name}        
        autoFocus={autofocus}
        autoComplete={autocomplete}
        placeholder={placeholder}
        className={styles["form-input"].concat(" form-input ").concat( className? className : "" )}
        required={required}
        id={id}
        onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
        disabled= {disabled }
        value={value}
        pattern={pattern}
        defaultValue={defaultValue}
        {...props}    
        // onKeyDown={(e=>console.log( e))}
        // onInvalid={e=>(e.target as HTMLInputElement).setCustomValidity('arroooooo')}
       
      />
    </label>
    </>
  );
  
}