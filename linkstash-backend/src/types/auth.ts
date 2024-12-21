//Auth related types
import {Principal} from '@loopback/security';
/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */
export type Credentials = {
  username: string;
  password: string;
};

export interface UserProfile extends Principal {
  id: string
}
