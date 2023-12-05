import styled from '@mui/material/styles/styled';
import { MixinFlexCenter } from '@/css/variables';

export const StyledForm= styled('form')(() => ({
  ...MixinFlexCenter,
  flexDirection: 'column',
}))

export const StyledTextarea = styled('textarea')(({ theme: { custom } }) => ({
  width: '900px',
  height: '200px',
  marginBottom: '33px',
  padding: '20px',
  outline: 'none',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: custom.colorTwilightSlate,
  resize: 'none',
  fontSize: '16px',
}))
