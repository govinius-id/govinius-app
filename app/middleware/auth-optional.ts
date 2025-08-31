export default defineNuxtRouteMiddleware(async () => {
  const cookieAccessToken = useCookie('access_token');

  if (!$auth().isLoggedIn && cookieAccessToken.value) {
    await $auth().fetchUser();
  }
});
