import { THEME_CUSTOMIZATION } from "@/theme/ThemeCustomizations";

// TODO: mixins to MUI and remove
export const MixinFlexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const MixinBtn = {
  width: '100%',
  height: '30px',
  padding: '0',
  borderRadius: '5px',
  background: THEME_CUSTOMIZATION.colorAzureBlue,
  color: THEME_CUSTOMIZATION.colorSnowWhite,
  textTransform: 'none',
  lineHeight: '1.5',
  transition: 'transform 0.5s ease, box-shadow 0.5s ease',

  '&:disabled': {
    color: THEME_CUSTOMIZATION.colorSnowWhite,
    opacity: '0.3',
  },

  '&:hover': {
    background: THEME_CUSTOMIZATION.colorAzureBlue,
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px -2px rgba(39, 94, 254, 0.5)',
  },
};

export const MixinGridContainer = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  height: 'calc(100vh - 80px)',
  backgroundColor: THEME_CUSTOMIZATION.colorMidnightCoal,
};
