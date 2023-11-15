import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
      accessToken: '',
      refreshToken: '',
      isAuthenticated : false,
     }),
    getters: {},
    actions: {
      initStore() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken && refreshToken) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
          this.isAuthenticated  = true;
        }
      },
      login(accessToken:string, refreshToken:string) {
        this.isAuthenticated  = true;
        
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      },
      logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
  })