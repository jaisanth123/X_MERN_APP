import daisyUIThemes  from "daisyui/src/theming/themes"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
        themes: ["light",
          // it will have two themes light and black  here the light theme is default and the black theme has some colors overwritten
          {
            black: {
              ...daisyUIThemes["black"],
              primary: "rgb(29,155,240)",  //twitter blue color  //! when we use primary in tailwind that will use this color
              secondary: "rgb(24,24,24)",
            },
          },
        ],
      },
    
  
}

