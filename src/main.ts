import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { env } from './env';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
// document.addEventListener('unload', async () => {
//   let myid = JSON.parse(localStorage.getItem('user') || '{}')._id;
//   let response = await fetch(env.api_url + '/user/setStatus' + myid, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ status: 'offline' }),
//   });
//   let json = await response.json();
//   console.log(json);
// });
