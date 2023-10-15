import { IoClose } from "react-icons/io5"
import { Box, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material"

const ViewApparelWidget = ({ picturePath, name, apparelId, section, handleViewClose }) => {
  const isSmallMobileScreens = useMediaQuery("(max-width:800px) and (max-height:800px)")
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const { palette } = useTheme()

  // Remove file extension from apparel name
  const displayName = name.replace(/\..*$/, "")

  return (
    <Box margin={isNonMobileScreens ? "1rem 2rem" : 0.5} padding={isNonMobileScreens ? 3 : 2}>

      {!isNonMobileScreens && (
        <Box padding={"0.5rem 0.5rem 0 0.5rem"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>

          <IconButton onClick={handleViewClose}>
            <IoClose color={palette.neutral.dark} />
          </IconButton>
        </Box>
      )}

      <Box margin={isNonMobileScreens ? 1 : 2}>
        <Typography variant="h4" color={palette.neutral.main} textAlign={"center"}>{displayName}</Typography>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
          {picturePath && (
            <img
              width={isSmallMobileScreens ? "72%" : isHDScreens ? "60%" : isNonMobileScreens ? "100%" : "80%"}
              height="auto"
              alt="apparel"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem", aspectRatio: "1" }}
              src={`https://slay-style-app.s3.us-west-1.amazonaws.com/${picturePath}`}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ViewApparelWidget