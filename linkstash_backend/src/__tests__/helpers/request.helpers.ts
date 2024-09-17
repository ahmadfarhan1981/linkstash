import {NewUserRequest} from '../../controllers';


export function givenNewUserRequest(data:Partial<NewUserRequest>){
  const defaultNewUserRequest:NewUserRequest  =new NewUserRequest({
    username: "random.username",

  })
  defaultNewUserRequest.password = "long_password_123";
  return Object.assign(defaultNewUserRequest, data)

}
