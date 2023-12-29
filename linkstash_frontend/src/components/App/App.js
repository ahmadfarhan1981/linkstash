import { useEffect } from "react";

export default function App() {
  // useEffect(() => {
  //   fetch("http://localhost:3030/bookmarks",{
  //       method: "Get",
  //       headers: {
  //           "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE3MDM4MTQ3NzQsImV4cCI6MTcwMzkwMTE3NCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsInN1YiI6IjEiLCJqdGkiOiJkOWU5MWJmMi0yMWMxLTRjZTYtODhlYS1jMjJmNWU3OTZhNjcifQ.C7DdQGAhNEAcXfMiKj_0ne2C6baj5a77ihqLygipII8",
  //           "$limit": "1"
  //       }
  //   }).then(async (response) => {
  //     console.log(await response.json());
  //   });
  // }, []);
  return (
    <>
      <h1>LinkStash</h1>

      <section className="login_form">
        <div className="content-area-header">
          <h2>Login</h2>
        </div>
        <form method="post" action="/login/" >          
          <div className="form-group">
            <label className="form-label" for="id_username">
              Username
            </label>
            <input
              type="text"
              name="username"
              autofocus=""
              autocapitalize="none"
              autocomplete="username"
              maxlength="150"
              placeholder=" "
              className="form-input"
              required=""
              id="id_username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" for="id_password">
              Password
            </label>
            <input
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder=" "
              className="form-input"
              required=""
              id="id_password"
            />
          </div>

          <br />
          <div className="d-flex justify-between">
            <input
              type="submit"
              value="Login"
              className="btn btn-primary btn-wide"
            />
          </div>
        </form>
      </section>
    </>
  );
}
