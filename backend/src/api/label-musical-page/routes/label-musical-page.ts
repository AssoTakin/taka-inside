export default {
  routes: [
    {
      method: 'GET',
      path: '/label-musical-page',
      handler: 'label-musical-page.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/label-musical-page',
      handler: 'label-musical-page.update',
      config: {
        auth: false,
      },
    },
  ],
};
