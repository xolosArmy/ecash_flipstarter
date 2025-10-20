import type { Config } from 'tailwindcss';
import sharedPreset from './tailwind.preset';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  presets: [sharedPreset]
};

export default config;
