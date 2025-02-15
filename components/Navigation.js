import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Link from 'next/link';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { useSessionId } from '../utils/session';
import { setSession, clearSession } from 'utils/session';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import NextLink from 'next/link';
import { Montserrat } from 'next/font/google';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { handleAddToCart } from 'utils/cart';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useUser } from '@auth0/nextjs-auth0/client';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
//import debounce from 'lodash/debounce';
import { Formik, Form, Field } from "formik";
import { useSearchState } from 'utils/search';

import { useRouter } from 'next/router';
import { useWishlistFunctions } from '@/utils/loginToast';
import { ca } from "date-fns/locale";

const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin']
});

const Search = styled('div')`
  width: '100%',
  },
`;

export default function Navigation({ sessionId }) {
  //const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { user, error, isLoading } = useUser();

  const { searchResults, setSearchResults } = useSearchState();
  const open = Boolean(anchorEl);

  //to render conditionally second stack on use profule page as we dont have access to search functionality from there
  const router = useRouter();
  const isUserProfilePage = router.pathname === '/profile';
  const isOrdersPage = router.pathname.startsWith('/orders');
  const isReviewsPage = router.pathname === '/reviews';
  const isCartPage = router.pathname === '/cart';
  const isWishlistPage = router.pathname === '/wishlist';
  /*
  const handleChange = (event) => {
    //  setSearchTerm(event.target.value);
    handleSearch(event.target.value)
  };
  */
  //Paintings menu open/close

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  //Profile menu open/close



  const handleCategorySearch = (async (categoryQuery) => {
    try {
      const response = await fetch('api/searchCategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: categoryQuery }),
      });
      const results = await response.json();
      setSearchResults(results[0].products);
    }
    catch (error) {
      console.error('Error', error);
    }
  });

  const handleClick = (value) => {
    handleCategorySearch(value);
  };




  const handleSearch = (async (searchQuery) => {
    //  const handleSearch = debounce(async (searchQuery) => {
    try {
      const response = await fetch('api/searchProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const results = await response.json();
      setSearchResults(results);
    }

    catch (error) {
      console.error('Error', error);
    }
  });
  // Debounce delay in milliseconds to delay search on input change
  //, 300);

  //-------------------WISHLIST, Cart, Profile LOGIC --------------------
  //pass this text to show in toaster
  const { showLoginToast } = useWishlistFunctions();
  const textToastFav = "Please log in to see your wishlist.";
  const textToastCart = "Please log in to see your cart.";
  const textToastProfile = "Please log in to access your account.";


  const theme = createTheme({
    typography: {
      fontFamily: [
        montserrat
      ]
    },
    palette: {
      primary: {
        main: '#324E4B'
        // light: will be calculated from palette.primary.main,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: '#F5C9C6'
      },
      warning: {
        main: '#893F04'
      },
      info: {
        main: '#fff'
      }
    },
  });
  // const userId = useSessionId();
  const userId = sessionId;

  const renderPaintingsMenu = (
    <Menu
      id="painting-menu-appbar"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem>
        <Button
          onClick={() => {
            handleClick('Watercolor');
            handleClose();
          }}
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'none',
            textTransform: "none",
            display: "flex",
            justifyContent: "flex-start",
            '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.dark },
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          Watercolour
        </Button>
      </MenuItem>
      <MenuItem>

        <Button
          onClick={() => {
            handleClick('Acrylic');
            handleClose();
          }}
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'none',
            textTransform: "none",
            display: "flex",
            justifyContent: "flex-start",
            '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.dark },
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          Acrylic
        </Button>

      </MenuItem>

      <MenuItem>
        <Button
          onClick={() => {
            handleClick('Oil');
            handleClose();
          }}
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'none',
            textTransform: "none",
            display: "flex",
            justifyContent: "flex-start",
            '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.dark },
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          Oil
        </Button>
      </MenuItem>

    </Menu>
  );

  const renderUserMenu = (
    <Menu
      id="user-menu-appbar"
      className={montserrat.className}
      sx={{ color: theme.palette.secondary.light }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      anchorEl={anchorEl2}
      open={Boolean(anchorEl2)}
      onClose={() => setAnchorEl2(null)}
    >
      <MenuItem>
        {userId &&
          <Typography>
            Hi, {user.first_name}!
          </Typography>
        }
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <NextLink
          href={{
            pathname: "/profile",
          }}
          passHref
          overlay="true"
          underline="none"
          sx={{
            color: theme.palette.info.main,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            padding: "1em",
          }}
        >
          Profile
        </NextLink>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <NextLink
          href={{
            pathname: "/orders",
          }}
          passHref
          overlay="true"
          underline="none"
          sx={{
            color: theme.palette.info.main,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            padding: "1em",
          }}
        >
          <Typography
            sx={{ color: theme.palette.primary.dark }}
          >
            Orders
          </Typography>
        </NextLink>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <NextLink
          sx={{
            color: theme.palette.info.main,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            padding: "1em",
          }}
          href={{
            pathname: "/api/auth/logout",
          }}
          passHref
          overlay="true"
          underline="none"
          onClick={clearSession}
        >
          Logout
        </NextLink>
      </MenuItem>
    </Menu>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        position="sticky"
        top={0}
        sx={{ width: '100%', zIndex: "1000" }}
      >
        <Stack>
          <AppBar
            position="static"
            className={montserrat.className}
            sx={{ padding: "0.5em 1.5em", borderBottom: `thick double ${theme.palette.secondary.main}` }}
          >
            <Toolbar
              sx={{ display: "flex", justifyContent: "flex-start", paddingTop: "1.5em" }}
            >
              <Link href={'/'}>
                <img
                  src='../uploads/smartartlogo.png'
                  style={{
                    height: "6em", 
                    width: "100%",
                  }}
                />
              </Link>
            </Toolbar>
            <Toolbar
              sx={{ display: "flex", justifyContent: "flex-end", marginLeft: "auto", marginRight: 0, marginTop: '-4em' }}
            >
              {!userId &&
                <NextLink
                  href={{
                    pathname: "/api/auth/login",
                  }}
                  passHref
                  overlay="true"
                  underline="none"
                  sx={{
                    color: theme.palette.info.main
                  }}
                >
                  <Typography sx={{
                    marginRight: "1.5em",
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.dark },
                    [theme.breakpoints.down("lg")]: {
                      fontSize: "0.8em",
                    },
                    [theme.breakpoints.down("md")]: {
                      fontSize: "0.65em",
                    },
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "0.5em",
                    },
                  }}>
                    Sign In
                  </Typography>
                </NextLink>}
              {/* Check if userId is available, otherwise show the login toast */}
              {userId ? (
                <Tooltip
                  title="Wishlist"
                  placement="top"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: "large",
                        marginRight: "1.75em",
                        [theme.breakpoints.down("lg")]: {
                          fontSize: "0.8em",
                        },
                        [theme.breakpoints.down("md")]: {
                          fontSize: "0.65em",
                        },
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.5em",
                        },
                      },
                    },
                  }}
                  arrow
                >
                  <>
                    <NextLink
                      href={{
                        pathname: "/wishlist",
                      }}
                      passHref
                      overlay="true"
                      underline="none"
                      sx={{ color: theme.palette.info.main }}
                    >
                      <FavoriteBorderIcon sx={{
                        fontSize: "2em",
                        marginRight: "1em",
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.secondary.dark },
                        [theme.breakpoints.down("lg")]: {
                          fontSize: "1.5em",
                        },
                        [theme.breakpoints.down("md")]: {
                          fontSize: "1em",
                        },
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.75em",
                        },
                      }}
                      />
                    </NextLink>
                  </>
                </Tooltip>
              ) : (
                <div onClick={() => showLoginToast(textToastFav)}>
                  <Tooltip
                    title="Wishlist"
                    placement="top"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: "large",
                          [theme.breakpoints.down("lg")]: {
                            fontSize: "0.8em",
                          },
                          [theme.breakpoints.down("md")]: {
                            fontSize: "0.65em",
                          },
                          [theme.breakpoints.down("sm")]: {
                            fontSize: "0.5em",
                          },
                        },
                      },
                    }}
                    arrow
                  >
                    <FavoriteBorderIcon sx={{
                      marginRight: "0.5em",
                      fontSize: "2em",
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.secondary.dark },
                      [theme.breakpoints.down("lg")]: {
                        fontSize: "1.5em",
                      },
                      [theme.breakpoints.down("md")]: {
                        fontSize: "1em",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.75em",
                      },
                    }}
                    />
                  </Tooltip>
                </div>
              )}
              {/* Check if userId is available, otherwise show the login toast */}
              {userId ? (
                <Tooltip
                  title="Cart"
                  placement="top"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: "large",
                        [theme.breakpoints.down("lg")]: {
                          fontSize: "0.8em",
                        },
                        [theme.breakpoints.down("md")]: {
                          fontSize: "0.65em",
                        },
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.5em",
                        },
                      },
                    },
                  }}
                  arrow
                >
                  <>
                    <NextLink
                      href={{
                        pathname: "/cart",
                      }}
                      passHref
                      overlay="true"
                      underline="none"
                      sx={{ color: theme.palette.info.main }}
                    >
                      <ShoppingCartCheckoutIcon sx={{
                        fontSize: "2em",
                        marginLeft: "0.5em",
                        marginRight: "0.5em",
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.secondary.dark },
                        [theme.breakpoints.down("lg")]: {
                          fontSize: "1.5em",
                        },
                        [theme.breakpoints.down("md")]: {
                          fontSize: "1em",
                        },
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.75em",
                        },
                      }}
                      />
                    </NextLink>
                  </>
                </Tooltip>
              ) : (
                <>
                  <div onClick={() => showLoginToast(textToastCart)}>
                    <Tooltip
                      title="Cart"
                      placement="top"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: "large",
                            [theme.breakpoints.down("lg")]: {
                              fontSize: "0.8em",
                            },
                            [theme.breakpoints.down("md")]: {
                              fontSize: "0.65em",
                            },
                            [theme.breakpoints.down("sm")]: {
                              fontSize: "0.5em",
                            },
                          },
                        },
                      }}
                      arrow
                    >
                      <ShoppingCartCheckoutIcon sx={{
                        margin: "0.5em",
                        fontSize: "2em",
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.secondary.dark },
                        [theme.breakpoints.down("lg")]: {
                          fontSize: "1.5em",
                        },
                        [theme.breakpoints.down("md")]: {
                          fontSize: "1em",
                        },
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.75em",
                        },
                      }}
                      />
                    </Tooltip>
                  </div>
                </>
              )}
              {/* Check if userId is available, otherwise show the login toast */}
              {userId ? (
                <Tooltip
                  title="Account"
                  placement="top"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: "large",
                        [theme.breakpoints.down("lg")]: {
                          fontSize: "0.8em",
                        },
                        [theme.breakpoints.down("md")]: {
                          fontSize: "0.65em",
                        },
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.5em",
                        },
                      },
                    },
                  }}
                  arrow
                >
                  <>
                    <Button
                      edge="start"
                      color="inherit"
                      aria-label="open drawer"
                      fontSize="10em"
                      sx={{ mr: 2, className: montserrat.className, textTransform: "none" }}
                      onClick={e => setAnchorEl2(e.currentTarget)}
                      endIcon={<ManageAccountsIcon
                        sx={{
                          color: theme.palette.info.main,
                          textTransform: "none",
                          fontSize: "2.5em !important",
                          textDecoration: 'none',
                          '&:hover': { color: theme.palette.secondary.dark },
                          [theme.breakpoints.down("lg")]: {
                            fontSize: "1.5em",
                          },
                          [theme.breakpoints.down("md")]: {
                            fontSize: "1em",
                          },
                          [theme.breakpoints.down("sm")]: {
                            fontSize: "0.75em",
                          },
                        }}
                      />}
                    >
                    </Button>{renderUserMenu}
                  </>
                </Tooltip>
              ) : (
                <div onClick={() => showLoginToast(textToastProfile)}>
                  <Tooltip
                    title="Account"
                    placement="top"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: "large",
                          [theme.breakpoints.down("lg")]: {
                            fontSize: "0.8em",
                          },
                          [theme.breakpoints.down("md")]: {
                            fontSize: "0.65em",
                          },
                          [theme.breakpoints.down("sm")]: {
                            fontSize: "0.5em",
                          },
                        },
                      },
                    }}
                    arrow
                  >
                    <ManageAccountsIcon sx={{
                      margin: "0.5em",
                      fontSize: "2em",
                      textDecoration: 'none',
                      '&:hover': { color: theme.palette.secondary.dark },
                      [theme.breakpoints.down("lg")]: {
                        fontSize: "1.5em",
                      },
                      [theme.breakpoints.down("md")]: {
                        fontSize: "1em",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.75em",
                      },
                    }}
                    />
                  </Tooltip>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </Stack>

        {!isUserProfilePage && !isOrdersPage && !isReviewsPage && !isCartPage && !isWishlistPage && (
          <Stack>
            <AppBar
              position="static"
              className={montserrat.className}
            >
              <Toolbar sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "0.5em 0",
                [theme.breakpoints.down("md")]: {
                  justifyContent: "space-around"
                },
                [theme.breakpoints.down("sm")]: {
                  justifyContent: "space-around"
                },
                }}>
                <NextLink
                  href={{
                    pathname: "/products",
                  }}
                  passHref
                  overlay="true"
                  sx={{ color: theme.palette.info.main }}
                //        onClick={clearSession}
                >
                  <Typography
                    sx={{
                      color: theme.palette.info.main,
                      paddingLeft: "3em",
                      paddingRight: "1em",
                      textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.light },
                      [theme.breakpoints.down("lg")]: {
                        fontSize: "0.8em",
                      },
                      [theme.breakpoints.down("md")]: {
                        fontSize: "0.65em",
                        paddingLeft: "1em"
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.5em",
                        paddingLeft: "1em"
                      },
                    }}
                  >
                    The Collection
                  </Typography>
                </NextLink>

                <Button
                  onClick={() => {
                    handleClick('Photography');
                  }}
                  sx={{
                    color: theme.palette.info.main,
                    textTransform: "none",
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}>
                  <Typography
                    sx={{
                      color: theme.palette.info.main,
                      paddingRight: "1em",
                      textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.light },
                      [theme.breakpoints.down("lg")]: {
                        fontSize: "0.8em",
                      },
                      [theme.breakpoints.down("md")]: {
                        fontSize: "0.65em",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.5em",
                      },
                    }}
                  >
                    Photography
                  </Typography>
                </Button>

                <Button
                  onClick={() => {
                    handleClick('Sculptures');
                  }}
                  sx={{
                    color: theme.palette.info.main,
                    textTransform: "none",
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}>
                  <Typography
                    sx={{
                      color: theme.palette.info.main,
                      paddingRight: "1em",
                      textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.light },
                      [theme.breakpoints.down("lg")]: {
                        fontSize: "0.8em",
                      },
                      [theme.breakpoints.down("md")]: {
                        fontSize: "0.65em",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.5em",
                      },
                    }}
                  >
                    Sculptures
                  </Typography>
                </Button>

                <Button
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{
                    mr: 2,
                    textTransform: 'none',
                    '&hover': { color: theme.palette.secondary.light },
                    fontFamily: theme.typography.fontFamily,
                    [theme.breakpoints.down("lg")]: {
                      fontSize: "0.8em",
                    },
                    [theme.breakpoints.down("md")]: {
                      fontSize: "0.65em",
                    },
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "0.5em",
                    },
                  }}
                  onClick={e => setAnchorEl(e.currentTarget)}
                  endIcon={<ArrowDropDownIcon sx={{ color: theme.palette.info }} />}
                >
                  Paintings
                </Button>

                {renderPaintingsMenu}

                <NextLink
                  href={{
                    pathname: "/sale",
                  }}
                  passHref
                  overlay="true"
                  underline="none"
                  sx={{ color: theme.palette.info.main }}
                //      onClick={clearSession}
                >
                  <Typography
                    sx={{
                      color: theme.palette.info.main,
                      textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.light },
                      marginLeft: "-1em",
                      paddingRight: "1em",
                      [theme.breakpoints.down("lg")]: {
                        fontSize: "0.8em",
                      },
                      [theme.breakpoints.down("md")]: {
                        fontSize: "0.65em",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.5em",
                      },
                    }}
                  >
                    Sale
                  </Typography>
                </NextLink>
                <NextLink
                  href={{
                    pathname: "/about",
                  }}
                  passHref
                  overlay="true"
                  underline="none"
                  sx={{ color: theme.palette.info.main }}
                //        onClick={clearSession}
                >
                  <Typography
                    sx={{
                      color: theme.palette.info.main,
                      paddingRight: "1em",
                      textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.secondary.light },
                      [theme.breakpoints.down("lg")]: {
                        fontSize: "0.8em",
                      },
                      [theme.breakpoints.down("md")]: {
                        fontSize: "0.65em",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.5em",
                      },
                    }}
                  >
                    About
                  </Typography>
                </NextLink>
                <Search>
                  <Formik initialValues={{ query: '' }} onSubmit={(values) => { handleSearch(values.query); }}>
                    <Form>
                      <Field
                        name="query"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Search…"
                            sx={{
                              backgroundColor: theme.palette.primary.light,
                              marginLeft: "auto", 
                              marginRight: 0,
                              [theme.breakpoints.down("lg")]: {
                                width: "90%"
                              },
                              [theme.breakpoints.down("md")]: {
                                width: "75%"
                              },
                              [theme.breakpoints.down("sm")]: {
                                width: "60%"
                              },
                            }}
                            InputProps={{
                              style: { 
                                color: theme.palette.secondary.main,
                                [theme.breakpoints.down("lg")]: {
                                  fontSize: "0.8em",
                                },
                                [theme.breakpoints.down("md")]: {
                                  fontSize: "0.65em",
                                },
                                [theme.breakpoints.down("sm")]: {
                                  fontSize: "0.5em",
                                }, 
                              },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <button type="submit"><SearchIcon sx={{ margin: "0.5em", fontSize: "2em", color: theme.palette.primary.main }} /></button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Form>
                  </Formik>
                </Search>

              </Toolbar>
            </AppBar>
          </Stack>
        )}
      </Box>
    </ThemeProvider >
  );

};
