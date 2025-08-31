export default defineEventHandler({
  handler: async (event) => {
    const user = await authService.findUser(event);
    event.context.user = user;
  },
});
