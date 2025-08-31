export default defineNuxtRouteMiddleware(() => {
  $changeThemeMode($themeMode());
});
