import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

export function useAuth() {
  const { isAuthenticated, admin, setAuth, clearAuth } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setAuth(data);
    if (error) clearAuth();
  }, [data, error, setAuth, clearAuth]);

  return { isAuthenticated: !!data, admin: data || admin, isLoading };
}
