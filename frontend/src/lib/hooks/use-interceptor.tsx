import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import base from "../api/base";

const useAxiosInterceptor = () => {
  const auth = useAuth();

  useEffect(() => {
    const requestInterceptor = base.interceptors.request.use(async (config) => {
      if (auth.isAuthenticated && auth.user) {
        const token = auth.user.access_token;
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    const responseInterceptor = base.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          auth.user
        ) {
          originalRequest._retry = true;

          try {
            await auth.signinSilent();
            const newAccessToken = auth.user?.access_token;

            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            return axios(originalRequest);
          } catch (refereshError) {
            console.error("Error refreshing token", refereshError);
            auth.removeUser();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      base.interceptors.request.eject(requestInterceptor);
      base.interceptors.response.eject(responseInterceptor);
    };
  }, [auth]);

  return base;
};

export default useAxiosInterceptor;
