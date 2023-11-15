import {authSession} from './sessions';

export default {
 
  login(body: any,headers: any) {
    return authSession.post('/api/token', body, { headers:headers });
  },
  refresh(body: any,headers: any) {
    return authSession.post('/api/token', body, { headers:headers });
  },
 
};