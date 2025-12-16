let navigationCallback = null;

export const setNavigate = (navigate) => {
  navigationCallback = navigate;
};

export const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (navigationCallback) {
        navigationCallback('/login');
      }
    }

    return response;
  };
};
