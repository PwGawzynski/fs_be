interface ICreateUserAsk {
  login: string;
  password: string;
  name: string;
  surname: string;
  age: number;
}

interface ICreateUserRes {
  status: boolean;
}
