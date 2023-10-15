import "../../styles/gradient-button.min.css"
import { useState, useEffect, lazy, Suspense } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import PropagateLoader from "react-spinners/PropagateLoader"
import { useQuery } from "@tanstack/react-query"
import { Box, Typography, useMediaQuery, Button, useTheme } from "@mui/material"
import {
  setDailyAllowedResets,
  setCreatingStyle,
  setEditingStyle,
  setDailyAllowedUploads,
  setDailyAllowedSaves,
  setDailyAllowedEdits,
  setDailyAllowedDeletes,
  setNextRefreshDate,
  setLogout
} from "state"
import Navbar from "views/navbar"
import apiUrl from "config/api"
const MobileFooterNavigation = lazy(() => import("../widgets/MobileFooterNavigation"))
const DesktopFooter = lazy(() => import("../widgets/DesktopFooter"))

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const { palette } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { _id } = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)
  const mode = useSelector((state) => state.mode)
  const nextRefreshDate = useSelector((state) => state.nextRefreshDate)

  const [stylesCount, setStylesCount] = useState(0)
  const [apparelsCount, setApparelsCount] = useState(0)

  const getApparelsCount = () => {
    return fetch(`${apiUrl}/apparels/${_id}/count`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(totalApparelsCount => {
        setApparelsCount(totalApparelsCount) // Retrived from Api
      })
  }

  const { data: apparelsCountData } = useQuery(["apparelsCountData"], getApparelsCount, {
    keepPreviousData: true,
    staleTime: 2000 //same duration as snackbar
  })

  const getStylesCount = () => {
    return fetch(`${apiUrl}/styles/${_id}/count`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(totalStylesCount => {
        setStylesCount(totalStylesCount) // Retrived from Api
      })
  }

  const { data: stylesCountData } = useQuery(["stylesCountData"], getStylesCount, {
    keepPreviousData: true,
    staleTime: 2000 //same duration as snackbar
  })

  if (apparelsCountData?.message === 'jwt expired' || stylesCountData?.message === 'jwt expired') {
    alert('App session has expired. Please login again.')
    dispatch(setLogout())
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

  const goToStyles = () => {
    navigate(`/styles/${_id}`)
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
  }, [])

  return (

    <Box>

      <Navbar />
      {/* ----- Page Body ----- */}
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={isNonMobileScreens ? "flex-end" : "center"}
        p={"2rem 4rem 0 4rem"}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          border={`solid 1px ${palette.neutral.medium}`}
          borderRadius={"6rem"}
          p={"0.5rem 2rem"}
        >
          <Typography color={palette.neutral.medium}>Apparels: </Typography>
          <Button
            onClick={goToWardrobe}
            sx={{
              color: palette.primary.main,
              borderRadius: "6rem",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                color: palette.primary.dark,
                backgroundColor: palette.background.default,
              }
            }}
          >
            {apparelsCount}
          </Button>
          <Typography color={palette.neutral.medium}>Styles: </Typography>
          <Button
            onClick={goToStyles}
            sx={{
              color: palette.primary.main,
              borderRadius: "6rem",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                color: palette.primary.dark,
                backgroundColor: palette.background.default,
              }
            }}
          >
            {stylesCount}
          </Button>
        </Box>
      </Box>
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
            // fontWeight={500}
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
            onClick={goToWardrobe}
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
            Manage Apparels
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
    </Box>
  )
}

export default HomePage