import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.user);

export const useIsLoggedIn = () => useAppSelector((state) => state.auth.isLoggedIn);
export const useToken = () => useAppSelector((state) => state.auth.token);

export const useUserInfo = () => {
  const authUserInfo = useAppSelector((state) => state.auth?.userInfo);
  const profile = useAppSelector((state) => state.user?.profile);
  return {
    ...profile,
    ...authUserInfo,
  };
};

export const useUserProfile = () => useAppSelector((state) => state.user.profile);
