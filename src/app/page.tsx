import Box from "@mui/material/Box";

export default function Home() {

  return (
    <>
      <Box component="section" sx={{
        background: '#262C3D',
        padding: '120px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '24px',
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Box
            sx={{
              backgroundImage: `url(/Home1.png)`,
              backgroundRepeat: 'no-repeat',
              width: '536px',
              height: '500px',
            }}>
            <Box
              sx={{
                backgroundImage: `url(/gradient1.png)`,
                backgroundRepeat: 'no-repeat',
                width: '522px',
                height: '522px',
                borderRadius: '50%'
              }}>
            </Box>
          </Box>
        </Box>
        <div style={{}}>
          ggg
        </div>
      </Box>
    </>
  )
}
