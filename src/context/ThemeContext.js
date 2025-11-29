/**
 * 主题上下文
 * - 在 Expo Router 中统一注入 light/dark 主题
 * - 暴露 hook 便于组件读取主题变量
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';

import { darkTheme, lightTheme } from '@/src/style';

const STORAGE_KEY = 'goabroad.theme-mode';

const ThemeContext = createContext({
  theme: lightTheme,
  themeMode: 'light',
  isDarkMode: false,
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme() || 'light';
  const [themeMode, setThemeModeState] = useState(systemColorScheme);
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  useEffect(() => {
    const loadThemePreference = async () => {
      const storedMode = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMode) {
        setThemeModeState(storedMode);
        setUseSystemTheme(false);
      }
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme && useSystemTheme) {
        setThemeModeState(colorScheme);
      }
    });
    return () => subscription.remove();
  }, [useSystemTheme]);

  const persistThemeMode = useCallback(async (mode) => {
    setUseSystemTheme(false);
    setThemeModeState(mode);
    await AsyncStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const setThemeMode = useCallback(
    async (mode) => {
      await persistThemeMode(mode);
    },
    [persistThemeMode],
  );

  const toggleTheme = useCallback(() => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  }, [setThemeMode, themeMode]);

  const value = useMemo(() => {
    const isDarkMode = themeMode === 'dark';
    return {
      theme: isDarkMode ? darkTheme : lightTheme,
      themeMode,
      isDarkMode,
      setThemeMode,
      toggleTheme,
    };
  }, [themeMode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);


