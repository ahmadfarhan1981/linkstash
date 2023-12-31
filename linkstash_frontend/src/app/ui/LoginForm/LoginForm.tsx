"use client"
const handleLogin = () =>{}
export default function LoginForm() {
    return ( 
        <>
        <h1>LinkStash</h1>
  
        <section className="login_form font-['Open Sans']">
          <div className="content-area-header">
            <h2>Login</h2>
          </div>
          <form method="post" action="login" onSubmit={handleLogin} >          
            <div className="form-group">
              <label className="form-label" htmlFor="id_email">
                Email
              </label>
              <input
                type="text"
                name="email"
                autoFocus="true"        
                autoComplete="email"              
                placeholder="Email"              
                className="form-input"
                required={true}
                id="id_email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="id_password">
                Password
              </label>
              <input
                type="password"
                name="password"
                autoComplete="password"
                placeholder="Password"
                className="form-input"
                required={true}
                id="id_password"
              />
              <input type="hidden" name="strategy" value="local" ></input>
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
    
    )
}