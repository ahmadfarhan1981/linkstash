"use client";

import { AlertBox, InputComponent, Loader } from "@/components";
import {
  ChangeEvent,
  useState,
} from "react";

import { generateClassNames } from "@/scripts";
import styles from "./LoginForm.module.css";
import { useAuthentication } from "@/hooks";

export function LoginForm() {
  const [isSubmited, setIsSubmited] = useState(false);
  const {login, AuthenticationState} = useAuthentication()
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
      {/* <AlertBox isVisible={AuthenticationState.isPending}  message="Loging in..." /> */}
      <AlertBox isVisible={ isSubmited && !AuthenticationState.isPending && !AuthenticationState.isLoggedIn} handleClose={()=>{setIsSubmited(false)}} message="Login failed." />
      <Loader isLoading={AuthenticationState.isPending} text="Checking login">
      <section className={styles['login-form']}>
        <div className="content-area-header">
          <h2>Login</h2>          
        </div>
        <form >
          <InputComponent id="email" type="text" name="email" placeholder="Username" label="Username" autocomplete="username" disabled={AuthenticationState.isPending} handleChange={handleChange} />
          <InputComponent id="password" type="password" name="password" placeholder="Password" label="Password" autocomplete="new-password" disabled={AuthenticationState.isPending} handleChange={handleChange} />         
         
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
            <div className="container mx-auto px-4">
              <p>&copy; 2024 LinkStash. All rights reserved.</p>
            </div>
          </footer>
      </Loader>
    </>
  );
}
