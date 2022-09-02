import { User } from '../../user/entities/user.entity';

export const registrationMail = (usr: User, link: string) => {
  return `
  <doctype html>
  <html lang='en'>
    <head>
    <title>Welcome on board</title>
    <meta charset='utf-8'>
    </head>
      <body>
          <div style='display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%;'>
              <h1>Welcome on Board ${usr.name} ${usr.surname} !!</h1>
              <p>We are very pleased that you've enjoyed to the fastest grooving moder farmers team</p>
              <p>We hoped you'll be satisfied with using our app, and its help you to manage your farm and yours farm-crew</p>
              <h3>But for now click on button bellow to activate your account</h3>
              <a href=${link}><button style=' width: 50%; border: none;  background: linear-gradient( 135deg, rgb(121, 241, 164) 10%, rgb(14, 92, 173) 100%); border-radius: 10px; height: 4vh; color: white; font-size: medium;
        font-weight: 600;'>Activate</button></a>
          </div>
      </body>
  </html>
  `;
};
