import "../../styles/gradient-button.min.css"
import { useState, useEffect, lazy, Suspense, forwardRef, CSSProperties } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import GridLoader from "react-spinners/GridLoader"
import PropagateLoader from "react-spinners/PropagateLoader"
import { styled } from "@mui/system"
import { Box, Typography, useMediaQuery, Button, useTheme, Grow, Dialog } from "@mui/material"
import {
  setDailyAllowedResets,
  setCreatingStyle,
  setEditingStyle,
  setDailyAllowedUploads,
  setDailyAllowedSaves,
  setDailyAllowedEdits,
  setDailyAllowedDeletes,
  setNextRefreshDate,
} from "state"
import Navbar from "views/navbar"
const MobileFooterNavigation = lazy(() => import("../widgets/MobileFooterNavigation"))
const DesktopFooter = lazy(() => import("../widgets/DesktopFooter"))
const ResetWardrobeWidget = lazy(() => import("views/widgets/ResetWardrobeWidget"))

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const ResetWardrobeDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "2rem"
  },
}))

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const { palette } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { _id } = useSelector((state) => state.user)
  const mode = useSelector((state) => state.mode)
  const nextRefreshDate = useSelector((state) => state.nextRefreshDate)
  const dailyAllowedResets = useSelector((state) => state.dailyAllowedResets)
  const guestUser = useSelector((state) => state.user.guestUser)

  /* Reset Wardrobe Popup Dialog State */
  const [resetWardrobeOpen, setResetWardrobeOpen] = useState(false)
  const handleResetWardrobeOpen = () => {
    setResetWardrobeOpen(true)
  }
  const handleResetWardrobeClose = () => {
    setResetWardrobeOpen(false)
  }

  const refreshGuestActions = () => {
    dispatch(setDailyAllowedResets({ dailyAllowedResets: 2 }))
    dispatch(setDailyAllowedUploads({ dailyAllowedUploads: 3 }))
    dispatch(setDailyAllowedSaves({ dailyAllowedSaves: 10 }))
    dispatch(setDailyAllowedEdits({ dailyAllowedEdits: 10 }))
    dispatch(setDailyAllowedDeletes({ dailyAllowedDeletes: 10 }))
    dispatch(setNextRefreshDate({ nextRefreshDate: null }))
  }

  const goToCreateStyle = () => {
    navigate(`/wardrobe/${_id}`)
    dispatch(setCreatingStyle({ creatingStyle: true }))
  }

  const goToWardrobe = () => {
    navigate(`/wardrobe/${_id}`)
    dispatch(setCreatingStyle({ creatingStyle: false }))
    dispatch(setEditingStyle({ editingStyle: false }))
  }

  const stylewidgetoverride: CSSProperties = {
    display: "block",
    margin: "3rem auto",
  }

  useEffect(() => {
    // if (Math.floor(Date.now()) > sessionExpireDate) {
    //   dispatch(setSessionExpireDate({ sessionExpireDate: Math.floor(Date.now()) + 86400000 }))
    // }
    if (!nextRefreshDate) {
      dispatch(setNextRefreshDate({ nextRefreshDate: Math.floor(Date.now()) + 86400000 }))
    }
    if (Math.floor(Date.now()) > parseInt(nextRefreshDate)) {
      refreshGuestActions()
      dispatch(setNextRefreshDate({ nextRefreshDate: Math.floor(Date.now()) + 86400000 }))
    }
    return
  }, [])

  return (

    <Box>

      <Navbar />
      {/* ----- Page Body ----- */}
      <Box
        width="100%"
        padding={isNonMobileScreens ? "12rem 16%" : "2rem 8%"}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="center"
      >
        {/* ----- Mid Page Column ----- */}
        <Box
          flexBasis={isNonMobileScreens ? "64%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Typography
            variant={isHDScreens ? "h2" : isNonMobileScreens ? "h1" : "h2"}
            textAlign={"center"}
            color={palette.neutral.darker}
          >
            Build Your Wardrobe
          </Typography>

          <Button
            onClick={goToCreateStyle}
            className={mode === "light" ? "gradient-button" : "gradient-button-dark"}
            size="medium"
            sx={
              (isNonMobileScreens && mode === "light") ?
                {
                  color: palette.neutral.dark,
                  margin: "2rem 32%",
                  padding: "1.5rem 6%",
                  borderRadius: "6rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "12px 16px 38px rgba(0,0,0, 0.15),-12px -12px 30px #ffffff",
                  ":hover": {
                    backgroundColor: palette.background.default
                  }
                }
                :
                (!isNonMobileScreens && mode === "light") ?
                  {
                    color: palette.neutral.dark,
                    margin: "2rem 16%",
                    padding: "1.5rem 6%",
                    borderRadius: "6rem",
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "12px 16px 38px rgba(0,0,0, 0.15),-19px -19px 40px #ffffff",
                    ":hover": {
                      backgroundColor: palette.background.default
                    }
                  }
                  :
                  (!isNonMobileScreens && mode === "dark") ?
                    {
                      color: palette.primary.main,
                      margin: "2rem 16%",
                      padding: "1.5rem 2rem",
                      borderRadius: "6rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "15px 15px 40px rgba(0,0,0, 0.35), -15px -15px 40px #212125",
                      ":hover": {
                        backgroundColor: palette.background.default
                      }
                    }
                    :
                    {
                      color: palette.primary.main,
                      margin: "2rem 32%",
                      padding: "1.5rem 2rem",
                      borderRadius: "6rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "15px 15px 40px rgba(0,0,0, 0.35), -12px -12px 40px #212125",
                      ":hover": {
                        backgroundColor: palette.background.default
                      }
                    }
            }
          >
            Create Style
          </Button>

          <Button
            disabled={!isNonMobileScreens && (!guestUser || dailyAllowedResets < 1)}
            onClick={isNonMobileScreens ? goToWardrobe : handleResetWardrobeOpen}
            size="medium"
            variant="outlined"
            sx={
              isNonMobileScreens ?
                {
                  margin: "0 32%",
                  padding: "1rem 1.5rem",
                  textTransform: "none",
                  borderRadius: "6rem",
                  fontWeight: 600,
                  color: palette.neutral.dark,
                  borderColor: palette.neutral.dark,
                  "&:hover": {
                    color: palette.primary.main,
                  }
                }
                :
                {
                  margin: "0 16%",
                  padding: "1rem 1.5rem",
                  textTransform: "none",
                  borderRadius: "6rem",
                  fontWeight: 600,
                  color: palette.neutral.dark,
                  borderColor: palette.neutral.dark,
                  "&:hover": {
                    color: palette.primary.main,
                  }
                }
            }
          >
            {isNonMobileScreens ? "Manage Apparels" : "Reset Wardrobe"}
          </Button>

        </Box>
        {isNonMobileScreens &&
          <Suspense fallback={
            <PropagateLoader
              color={palette.neutral.light}
              loading={true}
              // cssOverride={footeroverride}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          }>
            <DesktopFooter isHome />
          </Suspense>
        }
        {!isNonMobileScreens &&
          <Suspense fallback={
            <PropagateLoader
              color={palette.neutral.light}
              loading={true}
              // cssOverride={footeroverride}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          }>
            <MobileFooterNavigation isHome />
          </Suspense>
        }
      </Box>

      {/* ----- Popup Reset Wardrobe Dialog ----- */}
      <ResetWardrobeDialog
        open={resetWardrobeOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleResetWardrobeClose}
        aria-describedby="alert-dialog-grow-description"
      >
        <Suspense fallback={
          <GridLoader
            color={palette.neutral.light}
            loading={true}
            cssOverride={stylewidgetoverride}
            size={50}
            margin={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }>
          <ResetWardrobeWidget handleResetWardrobeClose={handleResetWardrobeClose} _id={_id} />
        </Suspense>
      </ResetWardrobeDialog>

    </Box>
  )
}

export default HomePage