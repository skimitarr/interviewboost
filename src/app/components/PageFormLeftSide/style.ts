import styled from '@mui/material/styles/styled';
import { MixinFlexCenter } from '@/styles/mixins';

export const StyledBtnWrapper = styled('div')(({ theme: { custom } }) => ({
  position: 'fixed',
  ...MixinFlexCenter,
  width: 'calc(100% * 1 / 3)',
  height: '80px',
  bottom: '0',
  padding: '0 25px',
  backgroundColor: custom.colorGraphiteGray,
  borderTop: `1px solid ${custom.colorSnowWhite}`,
}));
