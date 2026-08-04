import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
        colors: {
        primary: {
            50:  { value: "#EEF1F6" },
            100: { value: "#D6DCE8" },
            200: { value: "#AEB9D1" },
            300: { value: "#8590B0" },
            400: { value: "#4C5A85" },
            500: { value: "#1B2A4A" },  
            600: { value: "#16223C" },
            700: { value: "#0F172A" },  
            800: { value: "#0A0E1A" },
            900: { value: "#05070D" },
        },
        accent: {
            50:  { value: "#E6F7F5" },
            500: { value: "#0D9488" },  
            600: { value: "#0B7A70" },
        },
        neutral: {
            50:  { value: "#FFFFFF" },
            100: { value: "#F8FAFC" },
            200: { value: "#E2E8F0" },
            900: { value: "#0F172A" },
        }
      }
    },

    semanticTokens: {
          colors: {
            "bg.canvas": {
            value: {
                _light: "{colors.neutral.100}",   
                _dark: "{colors.primary.900}", 
            }
            },

            "bg.surface": {
            value: {
                _light: "{colors.neutral.50}",
                _dark: "{colors.primary.700}"
            }
            },

            "text.primary": {
            value: {
                _light: "{colors.primary.500}",
                _dark: "{colors.neutral.100}"
            }
            },

            "border.default": {
            value: {
                _light: "{colors.neutral.200}",
                _dark: "{colors.primary.500}"
            }
            }
         }
    }
}
})

export const system = createSystem(defaultConfig, config)