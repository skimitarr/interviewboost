import styled from '@mui/material/styles/styled';
import { colorWhite, colorBlack2, MixinFlexCenter } from '@/css/variables';

export const StyledBtnWrapper = styled('div')(() => ({
  position: 'fixed',
  ...MixinFlexCenter,
  width: 'calc(100% * 1 / 3)',
  height: '80px',
  bottom: '0',
  padding: '0 25px',
  backgroundColor: colorBlack2,
  borderTop: `1px solid ${colorWhite}`,
}));
