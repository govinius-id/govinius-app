export const useAuthUserStore = defineStore('authUserStore', () => {
  const isLoggedIn = ref(false);
  const user = ref<ItemUser | null>(null);

  const onFetchItemUser = async () => {
    isLoggedIn.value = false;

    const res: ApiResponse = await $axios().get('/auth/user');

    if (res?.statusCode === 200) {
      user.value = res.data;
      isLoggedIn.value = true;
    }
  };

  return {
    user,
    isLoggedIn,
    onFetchItemUser,
  };
});
