/**
 * GoAbroad Redux 自定义 Hooks
 * 提供类型安全的 dispatch 和 selector
 */

import { useDispatch, useSelector } from 'react-redux';

// 自定义 dispatch hook
export const useAppDispatch = () => useDispatch();

// 自定义 selector hook
export const useAppSelector = useSelector;

// 便捷的状态选择器 hooks
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.user);
export const useCountries = () => useAppSelector((state) => state.countries);
export const usePlanning = () => useAppSelector((state) => state.planning);
export const useCommunity = () => useAppSelector((state) => state.community);
export const useTools = () => useAppSelector((state) => state.tools);
export const useUI = () => useAppSelector((state) => state.ui);

// 便捷的认证状态选择器
export const useIsLoggedIn = () => useAppSelector((state) => state.auth.isLoggedIn);
export const useUserInfo = () => useAppSelector((state) => state.auth.userInfo);
export const useToken = () => useAppSelector((state) => state.auth.token);

// 便捷的用户信息选择器
export const useUserProfile = () => useAppSelector((state) => state.user.profile);
export const useUserPreferences = () => useAppSelector((state) => state.user.preferences);

// 便捷的 UI 状态选择器
export const useIsLoading = () => useAppSelector((state) => state.ui.loading);
export const useModal = () => useAppSelector((state) => state.ui.modal);
export const useToast = () => useAppSelector((state) => state.ui.toast);
