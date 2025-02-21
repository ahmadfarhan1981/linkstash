"use client";

import { AlertBox, InputComponent, Loader } from "@/components";
import {
  ChangeEvent,
  useState,
} from "react";

import { FaGithub, } from "react-icons/fa";

import { generateClassNames } from "@/scripts";
import styles from "./LoginForm.module.css";
import { useAuthentication } from "@/hooks";


export function LoginForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {login, AuthenticationState} = useAuthentication()
  const {isLoggedIn, isPending} = AuthenticationState;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const handleLogin = () => {
      setIsSubmitted(true)
        login(formData.email, formData.password) 
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  return (
    <div className={"flex  justify-center"}>

      {/* <AlertBox isVisible={isPending}  message="Loging in..." /> */}
      <AlertBox isVisible={ isSubmitted && !isPending && !isLoggedIn} handleClose={()=>{setIsSubmitted(false)}} message="Login failed." />

      <Loader isLoading={isPending} text="Checking login">
        <div className={"items-center"}>
      <section className={styles['login-form']}>
        <div className="content-area-header justify-items-center">

          <img src={'/img/icon.svg'} alt="login" width={"75px"} /> <h2>Linkstash login</h2>
        </div>
        <form >
          <InputComponent id="email" type="text" name="email" placeholder="Username" label="Username" autocomplete="username" disabled={isPending} handleChange={handleChange} />
          <InputComponent id="password" type="password" name="password" placeholder="Password" label="Password" autocomplete="new-password" disabled={isPending} handleChange={handleChange} />         
         
          <br />
          <div className="mt-2">
            <input
              type="submit"
              value="Login"
              className = { generateClassNames(styles, "submit-button")}
              onClick={(ev) => {
                ev.preventDefault();
                handleLogin();
              }}
            />
          </div>
        </form>
        </section>
          <footer>
            <div className="container mx-auto px-4 mt-2">
              <p>&copy; 2024 LinkStash. All rights reserved.</p>
            </div>
            <div className="flex justify-center space-x-6 text-gray-700">
              <a href="https://github.com/ahmadfarhan1981/linkstash/" target="_blank" rel="noopener noreferrer">
                <FaGithub className="w-6 h-6 hover:text-gray-600" />
              </a>
              <a href="https://linkstashapp.com" target="_blank" rel="noopener noreferrer">
                <img src={'/img/icon.svg'} className="w-6 h-6 hover:text-gray-600"  alt={"Liskstash website"}/>
              </a>
            </div>
          </footer>
        </div>
      </Loader>
    </div>
  );
}
