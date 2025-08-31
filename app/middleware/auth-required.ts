export default defineNuxtRouteMiddleware(async (to) => {
  const routeLogin = '/auth/login';
  const isNotRouteLogin = to.path !== routeLogin;

  if (!$auth().isLoggedIn && isNotRouteLogin) {
    await $auth().fetchUser();
  }

  if (!$auth().isLoggedIn) {
    if (import.meta.client) {
      window.location.href = '/auth/login';
    }
    if (import.meta.server) {
      navigateTo('/auth/login', { replace: true });
    }
  }
});
