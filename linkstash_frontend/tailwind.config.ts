import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        'accent': "hsl(305, 100%, 38%)",
        'accent-hover': "hsl(305, 100%, 43%)",
        'card-background': "hsl(214, 100%, 97%)",
        'primary-background': "hsl(0, 0%, 97%)",
        'primary-background-hover': "hsl(0, 0%, 100%)",
        'primary-text': "hsl(0, 0%, 27%)",
        'alert-background': "hsl(0, 72%, 50%)",
        'alert-background-hover': "hsl(0, 84%, 60%)",
        'alert-text': "hsl(0, 100%, 100%)"

      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
