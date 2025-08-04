export interface Theme {
  id: string;
  name: string;
  description: string;
  mood: string;
  fonts: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  palette: string[];
} 