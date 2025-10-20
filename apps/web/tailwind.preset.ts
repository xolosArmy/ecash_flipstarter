import type { Config } from 'tailwindcss';

const preset: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0f9d58',
          dark: '#0b6d3b',
          light: '#35d07f'
        }
      }
    }
  }
};

export default preset;
