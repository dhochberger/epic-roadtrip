export class User {
  user: {
    id?: any;
    username?: string;
    password?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
  };
  jwtToken?: string;
  refreshToken?: string;
}
