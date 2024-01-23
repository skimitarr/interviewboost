import { useState } from "react"
import { StaticImageData } from "next/image"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import flagUA from "../../../../public/ua.png"
import flagRU from "../../../../public/ru.png"
import flagEN from "../../../../public/en.svg"
import { StyledBtn, StyledImg, StyledList } from "./style"
import i18n from "@/locales/i18n"
import { useAppDispatch } from '../../hooks';
import { setLanguage } from "@/app/store/slices/user.slice"

type Language = {
  id: string
  text: string
  flag: StaticImageData
}

const data = [
  {
    id: 'ua',
    text: 'UA',
    flag: flagUA
  },
  {
    id: 'ru',
    text: 'RU',
    flag: flagRU
  },
  {
    id: 'en',
    text: 'EN',
    flag: flagEN
  },
]

export function ChooseLanguage() {
  const [currentLanguages, setCurrentLanguages] = useState(data[0]);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const dispatch = useAppDispatch()

  const handleChooseLanguage = (item: Language) => {
    setCurrentLanguages(item);
    setShowAllLanguages(false);
    i18n.changeLanguage(item.id);
    dispatch(setLanguage(item.id))
  }

  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      marginRight: '50px',
    }}>
      <StyledBtn isActive={showAllLanguages} onClick={() => setShowAllLanguages(!showAllLanguages)}>
        <StyledImg src={currentLanguages.flag.src} alt={currentLanguages.text} />
        <Typography sx={{ fontSize: '14px' }}>
          {currentLanguages.text}
        </Typography>
      </StyledBtn>

      {showAllLanguages && <StyledList>
        {data.map(item => (
          <Button
            key={item.id}
            onClick={() => handleChooseLanguage(item)}
            sx={{
              padding: '0 0 5px 0',
              color: 'white',
              borderRadius: '0',
              transition: 'background 0.3s ease-in-out',
              '&:hover': {
                background: '#557CFC',
              }
            }}
            startIcon={<Avatar
              alt="flag"
              src={item.flag.src}
              sx={{ width: '16px', height: '16px', borderRadius: 0 }}
            />}
          >
            {item.text}
          </Button>
        ))}
      </StyledList>}
    </Box>
  )
}
