export default defineNuxtRouteMiddleware(async () => {
  const cookieAccessToken = useCookie('access_token');

  if (!$auth().isLoggedIn && cookieAccessToken.value) {
    await $auth().fetchUser();
  }

  if ($auth().isLoggedIn) {
    if (import.meta.client) {
      window.location.href = '/panel';
    }
    if (import.meta.server) {
      navigateTo('/panel', { replace: true });
    }
  }
});
