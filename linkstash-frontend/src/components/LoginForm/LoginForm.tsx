"use client";

import {
  ChangeEvent,
  useState,
} from "react";
import {ShieldAlert, ShieldCheck} from 'lucide-react';
import { FaGithub, } from "react-icons/fa";

import { InputComponent, Loader } from "@/components";
import {Toast, useToast} from '@/components/Providers/ToastProvider';
import { generateClassNames } from "@/scripts";
import { useAuthentication } from "@/hooks";

import styles from "./LoginForm.module.css";





export function LoginForm() {
  const {login, AuthenticationState, setPostLoginSuccessCallback, setPostLoginFailureCallback} = useAuthentication()
  const {isPending} = AuthenticationState;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const handleLogin = () => {
      login(formData.email, formData.password)
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const { addToast } = useToast()

  const successToast:Toast = {summary:(<div><ShieldCheck className={"inline text-green-500"} />Login successful</div>), details:(<>Login successful</>), timeout:700}
  const failureToast:Toast = {summary:( <div><ShieldAlert className={"text-red-600 inline"}  />Login failed</div>), details:(<>Login failed</>)}
  setPostLoginSuccessCallback(()=>{addToast(successToast)})
  setPostLoginFailureCallback(()=>{addToast(failureToast)})


  return (
    <div className={"flex  justify-center"}>
      <Loader isLoading={isPending} text="Checking login">
        <div className={"items-center"}>
      <section className={styles['login-form']}>
        <div className="content-area-header justify-items-center grid">

          <img src={'/img/icon.svg'} className={""} alt="login" width={"75px"} /> <h2>Linkstash login</h2>
        </div>
        <form>

          <InputComponent className={"block"} id="email" type="text" name="email" placeholder="Username" label="Username" autocomplete="username" disabled={isPending} handleChange={handleChange} />
          <InputComponent className={"block"} id="password" type="password" name="password" placeholder="Password" label="Password" autocomplete="new-password" disabled={isPending} handleChange={handleChange} />
          <div className="mt-3">
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
