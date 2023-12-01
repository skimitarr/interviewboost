import styled from '@mui/material/styles/styled';
import { colorBlack3 } from '@/css/variables';

export const StyledInput = styled('input')<{showIcon: boolean}>(({showIcon}) => ({
  width: '100%',
  height: '40px',
  marginBottom: '16px',
  padding: '0 20px',
  paddingLeft: showIcon ? '50px' : '20px',
  backgroundColor: colorBlack3,
  backgroundImage: showIcon ? `url('../../../Vector.svg')` : 'none',
  backgroundSize: '20px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '20px center',
  borderRadius: '5px',
  border: 'none',
  outline: 'none',
}))

export const StyledInputClear = styled('div')(() => ({
  position: 'absolute',
  top: '13px',
  right: '18px',
  width: '14px',
  height: '14px',
  backgroundImage: `url('../../../ClearSearch.svg')`,
  cursor: 'pointer',
}))
