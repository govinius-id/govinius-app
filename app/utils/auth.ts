export const $auth = () => {
  const authUserStore = useAuthUserStore();
  const authTokenStore = useAuthTokenStore();
  const authLogoutStore = useAuthLogoutStore();

  return {
    isLoggedIn: authUserStore.isLoggedIn,
    user: authUserStore.user,
    fetchUser: authUserStore.onFetchItemUser,
    refreshToken: authTokenStore.onRefreshToken,
    clearToken: authTokenStore.onClearToken,
    logout: authLogoutStore.onLogout,
  };
};
