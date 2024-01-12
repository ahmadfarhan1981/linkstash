"use client";

import {
  ChangeEvent,
  Suspense,
  useContext,
  useState,
} from "react";

import  AlertBox from "@/components/AlertBox/AlertBox";
import { Authentication } from "@/app/context/authentication";
;import { BiError } from "react-icons/bi";
import { IconContext } from "react-icons";
import { InputComponent } from "..";
import {generateClassNames} from "@/scripts/styles/index"
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [isSubmited, setIsSubmited] = useState(false);
  const AuthenticationContext = useContext(Authentication)
  const {login, AuthenticationState} = AuthenticationContext
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const handleLogin = () => {
      setIsSubmited(true)
        login(formData.email, formData.password) 
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  
  return (
    <>      
      <AlertBox isVisible={AuthenticationState.isPending} message="Loging in..." />
      <AlertBox isVisible={ isSubmited && !AuthenticationState.isPending && !AuthenticationState.isLoggedIn} handleClose={()=>{setIsSubmited(false)}} message="Login failed" />
      <section className={styles['login-form']}>
        <div className="content-area-header">
          <h2>Login</h2>
          {/* <h2>{JSON.stringify(AuthenticationContext.AuthenticationState)}</h2> */}
        </div>
        <form >
          <InputComponent id="email" type="text" name="email" placeholder="Email" label="Email" autocomplete="username" enabled={!AuthenticationState.isPending} handleChange={handleChange} />
          <InputComponent id="password" type="password" name="password" placeholder="Email" label="Password" autocomplete="new-password" enabled={!AuthenticationState.isPending} handleChange={handleChange} />         
         
          <br />
          <div className="mt-2">
            <input
              type="submit"
              value="Login"
              className = {generateClassNames(styles, "submit-button")}
              onClick={(ev) => {
                ev.preventDefault();
                handleLogin();
              }}
            />
          </div>
        </form>
      </section>      
    </>
  );
}
