import Image from 'next/image';
import styled from '@mui/material/styles/styled';
import { keyframes } from '@mui/system';
import { MixinFlexCenter } from '@/styles/mixins';

const text1 = {
  lineHeight: '24px',
  letterSpacing: '-0.176px',
}

const text2 = {
  fontSize: '40px',
  fontWeight: '700',
  lineHeight: '120%',
  letterSpacing: '-0.88px',
}

const text3 = {
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '32px',
  letterSpacing: '-0.504px',
}

export const StyledContainer = styled('div')(({theme: {custom}}) => ({
  background: custom.colorGraphiteGray,
}))

export const StyledSection1 = styled('section')(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '24px',
  position: 'relative',
  height: '760px',
  padding: '120px 40px 240px',
  overflow: 'hidden',
}))

export const StyledImgBack = styled(Image)(() => ({
  marginTop: '-50px',
}))

export const StyledGradientBack = styled(Image)(() => ({
  position: 'absolute',
  top: '-120px',
  left: '50%',
  transform: 'translateX(-50%)',
}))

export const StyledPromo = styled('span')(() => ({
  display: 'inline-block',
  marginBottom: '16px',
  padding: '6px 16px',
  backgroundColor: '#262C3D',    // TODO
  borderRadius: '100px',
  fontSize: '14px',
  ...text1,
  color: '#AFAFB0',               // TODO
}))

export const StyledTitle = styled('h1')(() => ({
  width: '700px',
  marginBottom: '24px',
  fontSize: '48px',
  fontWeight: '700',
  lineHeight: '120%',
  letterSpacing: '-1.056px',
}))

export const StyledText1 = styled('p')(() => ({
  width: '500px',
  marginBottom: '40px',
  ...text1,
  color: '#AFAFB0',               // TODO
}))

export const StyledBtn = styled('button')(({ theme: { custom } }) => ({
  ...MixinFlexCenter,
  padding: '8px 48px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: custom.colorAzureBlue,
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '-0.176px',
  cursor: 'pointer',
  transition: 'transform 0.5s ease, box-shadow 0.5s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px -2px rgba(39, 94, 254, 0.5)',
  },
}))

export const StyledSection1__gradient = styled('div')(() => ({
  position: 'absolute',
  top: '-104px',
  right: '-184px',
  width: '517px',
  height: '517px',
  background: '-webkit-linear-gradient(left, rgba(0, 0, 0, 0), rgba(85, 170, 255, 3))',
  filter: 'blur(150px)',
}))

export const StyledSection2 = styled('section')(() => ({
  width: '1528px',
  height: '776px',
  padding: '40px 0 40px',
  margin: '0 auto',
}))

export const StyledTitle2 = styled('span')(() => ({
 ...text2,
}))

export const StyledTitle2__blue = styled('span')(({ theme: { custom } }) => ({
  color: custom.colorAzureBlue,
  ...text2,
}))

export const StyledSection2__wrapper = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '448px 1fr 448px',
  height: '480px',
}))

export const StyledBlock1 = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

export const StyledCard1 = styled('div')<{isActive: boolean}>(({isActive}) => ({
  height: '152px',
  padding: '20px 24px',
  borderRadius: '8px',
  border: isActive ? '2px solid #415EBF' : 'none',
  borderTop: '2px solid #415EBF',
  background: isActive ? '#262C3D' : 'transparent',            // TODO
  boxShadow: isActive ? '0px 8px 16px 2px rgba(0, 0, 0, 0.08)' : '0px 8px 16px 2px rgba(0, 0, 0, 0.08), 0px 0px 0px 2px rgba(255, 255, 255, 0.04) inset, 0px -4px 12px 0px rgba(65, 94, 191, 0.16)',
  transition: 'all 0.3s ease-in-out',
  '&:not(:last-child)': {
    marginBottom: '12px',
  }
}))

export const StyledCard1__text1 = styled('div')<{isActive: boolean}>(({isActive, theme: { custom }}) => ({
  width: '36px',
  height: '36px',
  marginBottom: '20px',
  padding: '5px 13px 5px 13px',
  borderRadius: '100px',
  border: isActive ? 'none' : `1px solid ${custom.colorAzureBlue}`,
  backgroundColor: isActive ? '#415EBF' : 'transparent',            // TODO
  fontWeight: '900',
  lineHeight: '24px',
  letterSpacing: '-0.176px',
  transition: 'all 0.3s ease-in-out',
}))

export const StyledCard1__text2 = styled('p')(() => ({
  marginBottom: '6px',
  ...text1,
}))

export const StyledCard1__text3 = styled('p')(() => ({
  color: '#D8D8D8',             // TODO
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '-0.084px',
}))

export const StyledBlock2 = styled('div')(() => ({
  ...MixinFlexCenter,
  position: 'relative',
}))

export const StyledBlock2__circle2 = styled('div')(() => ({
  ...MixinFlexCenter,
  width: '350px',
  height: '350px',
  borderRadius: '50%',
  background: '#252A3A',             // TODO
  animation: `${pulse} 2s ease-in-out infinite`,

  '&:before': {
    content: '""',
    width: '280px',
    height: '280px',
    background: '#232630',              // TODO
    opacity: '0.5',
    borderRadius: '50%',
  }
}))

const pulse = keyframes({
  '0%': {
    transform: 'scale(0.8)',
    boxShadow: '0 0 10px 0 rgba(37, 42, 58, 1), 0 0 10px 0 rgba(37, 42, 58, 1)',
  },
  '100%': {
    transform: 'scale(1.1)',
    boxShadow: '0 0 10px 0 rgba(255, 48, 26, 0), 0 0 4px 30px rgba(255, 48, 26, 0)',
  },
});

export const StyledBlock2__img = styled(Image)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  background: '#4F72E2',             // TODO
}))

export const StyledLine1__part1 = styled('div')<{isActive: boolean}>(({isActive, theme: { custom }}) => ({
  position: 'absolute',
  top: '75px',
  left: '0',
  width: '100px',
  border: isActive ? `2px dashed ${custom.colorAzureBlue}` : `2px dashed ${custom.colorTwilightSlate}`,             // TODO
  transition: 'border 0.3s ease-in-out',
}))

export const StyledLine1__part2 = styled(StyledLine1__part1)(() => ({
  left: '100px',
  width: '0',
  height: '150px',
}))

export const StyledLine1__part3 = styled(StyledLine1__part1)(() => ({
  top: '225px',
  left: '100px',
  width: '95px',
}))

export const StyledDot1 = styled('div')<{isActive: boolean}>(({isActive}) => ({
  position: 'absolute',
  width: isActive ? '15px' : '0',
  height: isActive ? '15px' : '0',
  borderRadius: '50%',
  backgroundColor: '#557CFC',
  filter: 'blur(2px)',
  animation: isActive ? `${moveDot1} 3s linear infinite` : 'none',
}))

const moveDot1 = keyframes ({
  '0%': {
    top: '220px',
    left: '195px',
  },
  '33%': {
    top: '220px',
    left: '95px',
  },
  '66%':{
    top: '70px',
    left: '95px',
  },
  '100%': {
    top: '70px',
    left: '0px',
  },
})

export const StyledLine2 = styled(StyledLine1__part1)(() => ({
  top: '240px',
  width: '195px',
}))

export const StyledDot2 = styled(StyledDot1)<{isActive: boolean}>(({isActive}) => ({
  animation: isActive ? `${moveDot2} 3s linear infinite` : 'none',
}))

const moveDot2 = keyframes ({
  '0%': {
    top: '235px',
    left: '195px',
  },
  '100%': {
    top: '235px',
    left: '0px',
  },
})

export const StyledLine3__part1 = styled(StyledLine1__part1)(() => ({
  top: '405px',
  left: '0',
  width: '100px',
}))

export const StyledLine3__part3 = styled(StyledLine3__part1)(() => ({
  top: '255px',
  left: '100px',
  width: '95px',
}))

export const StyledLine3__part2 = styled(StyledLine3__part3)(() => ({
  left: '100px',
  width: '0',
  height: '150px',
}))

export const StyledDot3 = styled(StyledDot1)<{isActive: boolean}>(({isActive}) => ({
  animation: isActive ? `${moveDot3} 3s linear infinite` : 'none',
}))

const moveDot3 = keyframes ({
  '0%': {
    top: '250px',
    left: '195px',
  },
  '33%': {
    top: '250px',
    left: '95px',
  },
  '66%':{
    top: '400px',
    left: '95px',
  },
  '100%': {
    top: '400px',
    left: '0px',
  },
})

export const StyledLine4__part1 = styled(StyledLine1__part1)(() => ({
  top: '140px',
  left: 'initial',
  right: 0,
}))

export const StyledLine4__part2 = styled(StyledLine1__part2)(() => ({
  top: '140px',
  height: '85px',
  left: 'initial',
  right: '100px',
}))

export const StyledLine4__part3 = styled(StyledLine1__part3)(() => ({
  left: 'initial',
  right: '100px',
}))

export const StyledDot4 = styled(StyledDot1)<{isActive: boolean}>(({isActive}) => ({
  animation: isActive ? `${moveDot4} 3s linear infinite` : 'none',
}))

const moveDot4 = keyframes ({
  '0%': {
    top: '220px',
    right: '190px',
  },
  '33%': {
    top: '220px',
    right: '95px',
  },
  '66%':{
    top: '135px',
    right: '95px',
  },
  '100%': {
    top: '135px',
    right: '0px',
  },
})

export const StyledLine5__part1 = styled(StyledLine3__part1)(() => ({
  left: 'initial',
  right: 0,
  top: '340px',
}))

export const StyledLine5__part3 = styled(StyledLine3__part3)(() => ({
  left: 'initial',
  right: '100px',
}))

export const StyledLine5__part2 = styled(StyledLine5__part3)(() => ({
  width: '0',
  height: '84px',
}))

export const StyledDot5 = styled(StyledDot3)<{isActive: boolean}>(({isActive}) => ({
  animation: isActive ? `${moveDot5} 3s linear infinite` : 'none',
}))

const moveDot5 = keyframes ({
  '0%': {
    top: '250px',
    right: '190px',
  },
  '33%': {
    top: '250px',
    right: '95px',
  },
  '66%':{
    top: '335px',
    right: '95px',
  },
  '100%': {
    top: '335px',
    right: '0px',
  },
})







export const StyledBlock3 = styled(StyledBlock1)(() => ({
  margin: 'auto 0'
}))

export const StyledCard3 = styled(StyledCard1)(() => ({
  height: '176px',
}))

export const StyledSection3 = styled('section')(() => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  height: '708px',
  padding: '240px 0',
  overflow: 'hidden', // Обрезаем часть элемента, выходящую за пределы контейнера
}))

export const StyledTitle3 = styled('p')(() => ({
  ...text2,
 }))

 export const StyledTitle3__blue = styled('p')(({ theme: { custom } }) => ({
  color: custom.colorAzureBlue,
   ...text2,
 }))

 export const StyledSection3__text1 = styled('p')(() => ({
  marginBottom: '12px',
  fontSize: '18px',
  lineHeight: '24px',
  letterSpacing: '-0.306px',
}))

export const StyledSection3__text2 = styled('p')(() => ({
  marginBottom: '16px',
  color: '#AFAFB0',     // TODO
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '-0.084px',
}))

export const StyledSection3__text3 = styled('p')(() => ({
  padding: '16px 24px',
  borderRadius: '8px',
  border: '2px solid rgba(255, 255, 255, 0.04)',
  backgroundColor: '#262C3D',       // TODO
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '-0.084px',
}))

export const StyledSection3__gradient = styled('div')(() => ({
  position: 'absolute',
  top: '120px',
  right: '0',
  width: '675px',
  height: '468px',
  borderRadius: '675px',
  background: 'radial-gradient(105.36% 50% at 50% 50%, #557CFC 0%, rgba(85, 124, 252, 0.00) 100%)',
  filter: 'blur(80px)',
  transform: 'translateX(50%)',
}))

export const StyledSection4 = styled('section')(() => ({
  ...MixinFlexCenter,
  flexDirection: 'column',
}))

export const StyledSection4__Grid = styled('div')(() => ({
  display: 'grid',
  gap: '16px',
  maxWidth: '1222px',
  padding: '48px 20px 120px',
  gridTemplateRows: '144px 108px 188px',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  gridTemplateAreas:
    `"A A B B"
    "C C B B"
    "C C D E"`,
}))

export const StyledAreaA = styled('div')(() => ({
  gridArea: 'A',
  height: '144px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px',
  border: '2px solid rgba(255, 255, 255, 0.04)',
  background: 'linear-gradient(93deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.28) 100%), linear-gradient(0deg, #557CFC 0%, #557CFC 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.00) 100%), #242526',
  boxShadow: '0px 8px 16px 2px rgba(0, 0, 0, 0.08)',
}));

export const StyledAreaA__img = styled(Image)(() => ({
  margin: '0 24px 0 32px',
}));

export const StyledAreaA__text1 = styled('p')(() => ({
  marginBottom: '6px',
  ...text3,
}))

export const StyledAreaA__text2 = styled('p')(() => ({
  ...text1,
}))

export const StyledAreaB = styled('div')(() => ({
  gridArea: 'B',
  position: 'relative',
  height: '268px',
  padding: '32px 40px',
  borderRadius: '8px',
  borderTop: '3px solid #415EBF',                // TODO
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.00) 100%), #242526',
  boxShadow: '0px 8px 16px 2px rgba(0, 0, 0, 0.08), 0px 0px 0px 2px rgba(255, 255, 255, 0.04) inset, 0px 8px 16px 2px rgba(0, 0, 0, 0.08), 0px -4px 12px 0px rgba(65, 94, 191, 0.16)',
}));

export const StyledAreaB__text2 = styled(StyledAreaA__text2)(() => ({
  color: '#AFAFB0',               // TODO
}))

export const StyledAreaB__img = styled(Image)(() => ({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
}));

export const StyledAreaC = styled(StyledAreaB)(() => ({
  gridArea: 'C',
  height: '312px',
}));

export const StyledAreaC__img = styled(Image)(() => ({
  position: 'absolute',
  bottom: '0',
  left: '0',
}));

export const StyledAreaD = styled('div')(() => ({
  gridArea: 'D',
  height: '188px',
}));

export const StyledAreaD__wrapper = styled('div')(() => ({
  height: '100%',
  padding: '32px 36px',
  borderRadius: '8px',
  border: '2px solid #415EBF',                // TODO
  background: '#262C3D',                      // TODO
  boxShadow: '0px 8px 16px 2px rgba(0, 0, 0, 0.08)',
}));

export const StyledAreaD__text1 = styled('p')(() => ({
  marginBottom: '12px',
  ...text3,
}))

export const StyledAreaD__text2 = styled('p')(() => ({
  ...text1,
}))

export const StyledAreaE = styled(StyledAreaD)(() => ({
  gridArea: 'E',
}));

export const StyledAreaE__wrapper = styled(StyledAreaD__wrapper)(() => ({
  border: ' 2px solid rgba(255, 255, 255, 0.04)',
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.28) 100%), #557CFC',
}));

export const StyledSection5 = styled(StyledSection3)(() => ({
  height: '716px',
  padding: '280px 0',
}))

export const StyledSection5__text2 = styled(StyledSection3__text2)(() => ({
  marginBottom: '32px',
}))

export const StyledSection5__gradient = styled(StyledSection3__gradient)(() => ({
  left: '0',
  transform: 'translateX(-50%)',
}))

export const StyledFooter = styled('footer')(() => ({
  ...MixinFlexCenter,
  flexDirection: 'column',
  padding: '16px 0',
  borderTop: '1px solid #444546',
}))

export const StyledFooter__wrapper = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  ...MixinFlexCenter,
  padding: '20px',
}))

export const StyledLinkNavigation = styled('a')(() => ({
  '&:not(:last-child)': {
    marginRight: '48px'
  },
}))

export const StyledEmail = styled('a')(() => ({
  position: 'absolute',
  ...MixinFlexCenter,
  top: '20px',
  right: '40px',
  '&>svg': {
    marginRight: '8px'
  },
}))

export const StyledFooter__text = styled('p')(() => ({
  padding: '8px 0',
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '-0.084px',
  opacity: '0.7',
}))
