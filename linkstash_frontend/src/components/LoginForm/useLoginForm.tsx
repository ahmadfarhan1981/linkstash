"use client"
export type loginResponse= {
    success : boolean
    token :string
}

type useLoginFormReturnType= {
    login : ()=>loginResponse
}


const handleLogin = () => {
    const body = JSON.stringify({
      strategy: "local",
      email: formData.email,
      password: formData.password,
    });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch("http://localhost:3030/authentication/", {
      method: "POST",
      body: body,
      headers: headers,
    })
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((obj) => {
        console.log(obj);
        setLoginResponse((prevData) => ({
          ...prevData,
          status: obj.status,
          loggedIn: obj.status === 201,
          data: obj.body,
        }));

        if (obj.status === 201) {
          const cookie = new Cookies();
          cookie.set("Authorization", "Bearer ".concat(obj.body.accessToken));
          cookie.set("token", obj.body.accessToken);
          cookie.set("jwt", obj.body.accessToken);
        }
      });
  };


export function useLoginForm():useLoginFormReturnType{
    return {handleLogin}
}