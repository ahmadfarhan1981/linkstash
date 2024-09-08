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
        linkstashPurple : "hsl(305 100 38)",
        bookmarkCardBG: "hsl(214, 100%, 97%)",
        primaryBackground: "hsl(0, 0%, 98%)",
        primaryText: "hsl(0, 0%, 27%)"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
