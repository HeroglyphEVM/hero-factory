import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '../ui/button';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Button onClick={() => setTheme('light')} variant={theme === 'light' ? 'default' : 'outline'}>
        Light
      </Button>
      <Button onClick={() => setTheme('dark')} variant={theme === 'dark' ? 'default' : 'outline'}>
        Dark
      </Button>
      <Button onClick={() => setTheme('custom')} variant={theme === 'custom' ? 'default' : 'outline'}>
        Custom
      </Button>
    </div>
  );
};