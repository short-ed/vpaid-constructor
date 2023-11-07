// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      'background': 'var(--color-background)',
      'foreground': 'var(--color-foreground)',
      'primary': 'var(--color-primary)',
      'primary-foreground': 'var(--color-primary-foreground)',
      'muted': 'var(--color-muted)',
      'muted-foreground': 'var(--color-muted-foreground)',
      'card': 'var(--color-card)',
      'card-foreground': 'var(--color-card-foreground)',
      'accent': 'var(--color-accent)',
      'accent-foreground': 'var(--color-accent-foreground)',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      autoInstall: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  rules: [
    ['accessibilitu-hidden', {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    }],
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
