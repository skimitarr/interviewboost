export const сolorBtn = '#557CFC';
export const colorWhite = '#FFF';
export const colorBlack1 = '#202123';
export const colorBlack2 = '#242526';
export const colorBlack3 = '#3C3E49';
export const colorBlack4 = '#414350';
export const colorMainGradient = 'linear-gradient(180deg, #557CFC 0%, rgba(85, 124, 252, 0.09) 100%)';
export const colorBackgroundGradient = 'linear-gradient(180deg, #3F4852 0%, #272A2D 100%)'

export const сolorMark55 = '#EB6C66';
export const сolorMark65 = '#E9A469';
export const сolorMark75 = '#D3BE5D';
export const сolorMark85 = '#1583EC';
export const сolorMark100 = '#37A77B';

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
  background: сolorBtn,
  color: colorWhite,
  textTransform: 'none',
  lineHeight: '1.5',

  '&:disabled': {
    color: colorWhite,
    opacity: '0.3',
  }
};

export const MixinGridContainer = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  height: 'calc(100vh - 80px)',
  backgroundColor: colorBlack1,
};
