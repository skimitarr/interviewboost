'use client'
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MixinFlexCenter } from "@/styles/mixins";
import { navItems } from "./components/TheHeader";
import {
  StyledAreaA,
  StyledAreaA__img,
  StyledAreaA__text1,
  StyledAreaA__text2,
  StyledAreaB,
  StyledAreaB__img,
  StyledAreaB__text2,
  StyledAreaC,
  StyledAreaC__img,
  StyledAreaD,
  StyledAreaD__text1,
  StyledAreaD__text2,
  StyledAreaD__wrapper,
  StyledAreaE,
  StyledAreaE__wrapper,
  StyledBtn,
  StyledContainer,
  StyledEmail,
  StyledFooter,
  StyledFooter__text,
  StyledFooter__wrapper,
  StyledGradientBack,
  StyledImgBack,
  StyledLinkNavigation,
  StyledPromo,
  StyledSection1,
  StyledSection1__gradient,
  StyledSection2,
  StyledBlock1,
  StyledBlock2,
  StyledBlock3,
  StyledSection2__wrapper,
  StyledSection3,
  StyledSection3__gradient,
  StyledSection3__text1,
  StyledSection3__text2,
  StyledSection3__text3,
  StyledSection4,
  StyledSection4__Grid,
  StyledSection5,
  StyledSection5__gradient,
  StyledSection5__text2,
  StyledText1,
  StyledTitle,
  StyledTitle2,
  StyledTitle2__blue,
  StyledTitle3,
  StyledTitle3__blue,
  StyledCard1,
  StyledCard1__text1,
  StyledCard1__text2,
  StyledCard1__text3,
  StyledCard3,
  StyledBlock2__img,
  StyledBlock2__circle2,
  StyledLine1__part1,
  StyledLine1__part2,
  StyledLine1__part3,
  StyledDot1,
  StyledLine2,
  StyledDot2,
  StyledLine3__part1,
  StyledLine3__part2,
  StyledLine3__part3,
  StyledDot3,
  StyledLine5__part1,
  StyledLine5__part2,
  StyledLine5__part3,
  StyledDot5,
  StyledLine4__part1,
  StyledLine4__part2,
  StyledLine4__part3,
  StyledDot4,
} from "./style";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useSession();
  const [activeNumber, setActiveNumber] = useState<number>(1);

  useEffect(() => {
    let number = 1;
    let timerId: NodeJS.Timeout;
    const tick = () => {
      if (number > 5) {
        number = 1;
        setActiveNumber(1);
      }
      setActiveNumber(number++);
      timerId = setTimeout(tick, 10000);
    };
    timerId = setTimeout(tick, 10000);
    return () => {
      clearTimeout(timerId); // Остановка таймера при размонтировании компонента
    };
  }, []);

  return (
    <StyledContainer>
      <StyledSection1>
        <Box sx={{ ...MixinFlexCenter, position: 'relative' }}>
          <StyledImgBack
            src="/Home1.png"
            alt="Technical image"
            width={536}
            height={500}
            priority
          />
          <StyledGradientBack
            src="/gradient1.png"
            alt="Background light"
            width={622}
            height={622}
          />
        </Box>
        <Box sx={{ paddingTop: '40px' }}>
          <StyledPromo>
            {t('prepare')}
          </StyledPromo>
          <StyledTitle>
            {t('evaluate')}
          </StyledTitle>
          <StyledText1>
            {t('tool')}
          </StyledText1>
          <StyledBtn onClick={() => router.push('/position')}>
            {t('startFree')}
          </StyledBtn>

          <StyledSection1__gradient />
        </Box>
      </StyledSection1>

      <StyledSection2>
        <Box
          sx={{
            width: '900px',
            margin: '0 auto 120px',
            textAlign: 'center',
          }}>

          <StyledTitle2>
            {t('receive1')}
          </StyledTitle2>
          <StyledTitle2__blue>
            {t('receive2')}
          </StyledTitle2__blue>
          <StyledTitle2>
            {t('receive3')}
          </StyledTitle2>
        </Box>

        <StyledSection2__wrapper>
          <StyledBlock1>
            <StyledCard1 isActive={activeNumber === 1}>
              <StyledCard1__text1 isActive={activeNumber === 1}>1</StyledCard1__text1>
              <StyledCard1__text2>{t('startProfession')}</StyledCard1__text2>
              <StyledCard1__text3>{t('selectCandidate')}</StyledCard1__text3>
            </StyledCard1>

            <StyledCard1 isActive={activeNumber === 2}>
              <StyledCard1__text1 isActive={activeNumber === 2}>2</StyledCard1__text1>
              <StyledCard1__text2>{t('selectList')}</StyledCard1__text2>
              <StyledCard1__text3>{t('thenSelectList')}</StyledCard1__text3>
            </StyledCard1>

            <StyledCard1 isActive={activeNumber === 3}>
              <StyledCard1__text1 isActive={activeNumber === 3}>3</StyledCard1__text1>
              <StyledCard1__text2>{t('addQuestions')}</StyledCard1__text2>
              <StyledCard1__text3>{t('addInterview')}</StyledCard1__text3>
            </StyledCard1>
          </StyledBlock1>

          <StyledBlock2>
            <StyledBlock2__circle2 />
            <StyledBlock2__img
              src="/Home5.png"
              alt="Technical image"
              width={230}
              height={230}
            />
            <StyledLine1__part1 isActive={activeNumber === 1} />
            <StyledLine1__part2 isActive={activeNumber === 1} />
            <StyledLine1__part3 isActive={activeNumber === 1} />
            <StyledDot1 isActive={activeNumber === 1} />

            <StyledLine2 isActive={activeNumber === 2} />
            <StyledDot2 isActive={activeNumber === 2} />

            <StyledLine3__part1 isActive={activeNumber === 3} />
            <StyledLine3__part2 isActive={activeNumber === 3} />
            <StyledLine3__part3 isActive={activeNumber === 3} />
            <StyledDot3 isActive={activeNumber === 3} />

            <StyledLine4__part1 isActive={activeNumber === 4} />
            <StyledLine4__part2 isActive={activeNumber === 4} />
            <StyledLine4__part3 isActive={activeNumber === 4} />
            <StyledDot4 isActive={activeNumber === 4} />

            <StyledLine5__part1 isActive={activeNumber === 5} />
            <StyledLine5__part2 isActive={activeNumber === 5} />
            <StyledLine5__part3 isActive={activeNumber === 5} />
            <StyledDot5 isActive={activeNumber === 5} />

          </StyledBlock2>

          <StyledBlock3>
            <StyledCard3 isActive={activeNumber === 4}>
              <StyledCard1__text1 isActive={activeNumber === 4}>4</StyledCard1__text1>
              <StyledCard1__text2>{t('evaluateAnswers')}</StyledCard1__text2>
              <StyledCard1__text3>{t('evaluateResponses')}</StyledCard1__text3>
            </StyledCard3>

            <StyledCard3 isActive={activeNumber === 5}>
              <StyledCard1__text1 isActive={activeNumber === 5}>5</StyledCard1__text1>
              <StyledCard1__text2>{t('detailedReport')}</StyledCard1__text2>
              <StyledCard1__text3>{t('conclude')}</StyledCard1__text3>
            </StyledCard3>
          </StyledBlock3>

        </StyledSection2__wrapper>
      </StyledSection2>

      <StyledSection3>
        <Box sx={{ padding: '0 130px' }}>
          <StyledTitle3>
            {t('what1')}
          </StyledTitle3>
          <StyledTitle3__blue>
            {t('what2')}
          </StyledTitle3__blue>
          <StyledTitle3>
            {t('what3')}
          </StyledTitle3>
        </Box>

        <Box sx={{ width: '446px' }}>
          <StyledSection3__text1>
            {t('smartSolution')}
          </StyledSection3__text1>
          <StyledSection3__text2>
            {t('selectProfession')}
          </StyledSection3__text2>
          <StyledSection3__text3>
            {t('generateScoreReport')}
          </StyledSection3__text3>
        </Box>

        <StyledSection3__gradient />
      </StyledSection3>

      <StyledSection4>
        <StyledTitle2>
          {t('benefits')}
        </StyledTitle2>
        <StyledSection4__Grid>
          <StyledAreaA>
            <StyledAreaA__img
              src="/Home2.png"
              alt="Technical image"
              width={73}
              height={73}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <StyledAreaA__text1>{t('timeSaving')}</StyledAreaA__text1>
              <StyledAreaA__text2>{t('prepareReports')}</StyledAreaA__text2>
            </Box>
          </StyledAreaA>
          <StyledAreaB>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <StyledAreaA__text1>{t('personalisation')}</StyledAreaA__text1>
              <StyledAreaB__text2>{t('tailorQuestions')}</StyledAreaB__text2>
            </Box>
            <StyledAreaB__img
              src="/Home3.png"
              alt="Technical image"
              width={144}
              height={120}
            />
          </StyledAreaB>
          <StyledAreaC>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <StyledAreaA__text1>{t('improvedDecision')}</StyledAreaA__text1>
              <StyledAreaB__text2>{t('gatherInformation')}</StyledAreaB__text2>
            </Box>
            <StyledAreaC__img
              src="/Home4.png"
              alt="Technical image"
              width={273}
              height={224}
            />
          </StyledAreaC>
          <StyledAreaD>
            <StyledAreaD__wrapper>
              <StyledAreaD__text1>{t('flexible')}</StyledAreaD__text1>
              <StyledAreaD__text2>{t('suitable')}</StyledAreaD__text2>
            </StyledAreaD__wrapper>
          </StyledAreaD>
          <StyledAreaE>
            <StyledAreaE__wrapper>
              <StyledAreaD__text1>{t('artificialIntelligence')}</StyledAreaD__text1>
              <StyledAreaD__text2>{t('reportsGenerated')}</StyledAreaD__text2>
            </StyledAreaE__wrapper>
          </StyledAreaE>
        </StyledSection4__Grid>
      </StyledSection4>

      <StyledSection5>
        <Box sx={{ padding: '0 130px' }}>
          <StyledTitle3>
            {t('who1')}
          </StyledTitle3>
          <StyledTitle3__blue>
            {t('who2')}
          </StyledTitle3__blue>
          <StyledTitle3>
            {t('who3')}
          </StyledTitle3>
        </Box>

        <Box sx={{ width: '446px' }}>
          <StyledSection3__text1>
            {t('hrSpecialists')}
          </StyledSection3__text1>
          <StyledSection5__text2>
            {t('technicalExecutives')}
          </StyledSection5__text2>
          <StyledBtn onClick={() => router.push('/position')}>
            {t('startFree')}
          </StyledBtn>
        </Box>

        <StyledSection5__gradient />
      </StyledSection5>

      <StyledFooter>
        <StyledFooter__wrapper>
          {navItems.map(link => (
            <StyledLinkNavigation
              key={link.label}
              href={link.href}
            >
              <Typography>
                {t(link.label)}
              </Typography>
            </StyledLinkNavigation>
          ))}

          {session.data &&
            <StyledEmail>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6665 3.33398H3.33317C2.4165 3.33398 1.67484 4.08398 1.67484 5.00065L1.6665 15.0007C1.6665 15.9173 2.4165 16.6673 3.33317 16.6673H16.6665C17.5832 16.6673 18.3332 15.9173 18.3332 15.0007V5.00065C18.3332 4.08398 17.5832 3.33398 16.6665 3.33398ZM16.6665 6.66732L9.99984 10.834L3.33317 6.66732V5.00065L9.99984 9.16732L16.6665 5.00065V6.66732Z" fill="#557CFC" />
              </svg>
              {session.data.user?.email}
            </StyledEmail>
          }
        </StyledFooter__wrapper>

        <StyledFooter__text>{t('allRights')}</StyledFooter__text>
      </StyledFooter>
    </StyledContainer>
  )
}
