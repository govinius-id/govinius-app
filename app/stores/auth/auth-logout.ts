export const useAuthLogoutStore = defineStore('authLogoutStore', () => {
  const authTokenStore = useAuthTokenStore();

  const loadingLogout = ref(false);
  const onLogout = async () => {
    authTokenStore.onClearToken();

    loadingLogout.value = true;

    const res: ApiResponse = await $axios().patch('/auth/logout');

    if (res.statusCode === 200) {
      window.location.href = '/auth/login';
    }

    loadingLogout.value = false;
  };

  return {
    loadingLogout,
    onLogout,
  };
});
