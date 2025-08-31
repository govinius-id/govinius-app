export const useAuthTokenStore = defineStore('authTokenStore', () => {
  const onRefreshToken = async () => {
    const res: ApiResponse = await $axios().patch('/auth/refresh');

    if (res.statusCode === 200) {
      onStoreToken(res.data.access_token);
      return res.data.access_token;
    } else {
      onClearToken();
    }
    return null;
  };

  const onStoreToken = (accessToken: string) => {
    const cookieAccessToken = useCookie('access_token', {
      expires: $dayjs().tz().tz($timezone()).add(1, 'day').toDate(),
    });
    cookieAccessToken.value = accessToken;
  };

  const onClearToken = () => {
    const cookieAccessToken = useCookie('access_token');
    cookieAccessToken.value = undefined;
  };

  return {
    onRefreshToken,
    onStoreToken,
    onClearToken,
  };
});
