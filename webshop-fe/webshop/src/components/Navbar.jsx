
"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    useMediaQuery,
    useTheme,
    Avatar,
    InputBase,
    Snackbar, Alert
} from "@mui/material"
import {
    ShoppingCart,
    Person,
    Menu as MenuIcon,
    Search,
    Dashboard,
    Category,
    Logout,
    Login,
    PersonAdd,
    Home,
} from "@mui/icons-material"
import { styled, alpha } from "@mui/material/styles"
import { getCartItemsByUser } from "../utils/api"

// Styled search component
const SearchBox = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}))

const Navbar = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [cartCount, setCartCount] = useState(0)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    })
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const roles = JSON.parse(localStorage.getItem("roles") || "[]")
        const userId = localStorage.getItem("userId")

        setIsLoggedIn(!!token)
        setIsAdmin(roles.includes("ADMIN"))

        // Lấy số lượng sản phẩm trong giỏ hàng từ API
        const fetchCartCount = async () => {
            if (!userId || !token) {
                setCartCount(0) // Nếu chưa đăng nhập, số lượng giỏ hàng là 0
                return
            }

            try {
                const cartItems = await getCartItemsByUser(userId)
                setCartCount(cartItems.length) // Số lượng sản phẩm trong giỏ hàng
            } catch (err) {
                console.error("Error fetching cart count:", err)
                setCartCount(0) // Nếu có lỗi, đặt số lượng về 0
            }
        }

        fetchCartCount()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("roles")
        localStorage.removeItem("userId")
        setIsLoggedIn(false)
        setIsAdmin(false)
        setCartCount(0) // Reset cart count khi đăng xuất
        setSnackbar({
            open: true,
            message: "Đăng xuất thành công!",
            severity: "success",
        })
        navigate("/")

    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return
        }
        setDrawerOpen(open)
    }

    const menuId = "primary-account-menu"
    const isMenuOpen = Boolean(anchorEl)

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            {isLoggedIn ? (
                <>
                    <MenuItem
                        onClick={() => {
                            handleMenuClose()
                            navigate("/profile")
                        }}
                    >
                        <Avatar /> Tài khoản của tôi
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMenuClose()
                            navigate("/orders")
                        }}
                    >
                        <ListItemIcon>
                            <ShoppingCart fontSize="small" />
                        </ListItemIcon>
                        Đơn hàng của tôi
                    </MenuItem>
                    <Divider />
                    {isAdmin && (
                        <MenuItem
                            onClick={() => {
                                handleMenuClose()
                                navigate("/admin/dashboard")
                            }}
                        >
                            <ListItemIcon>
                                <Dashboard fontSize="small" />
                            </ListItemIcon>
                            Quản trị
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={() => {
                            handleMenuClose()
                            handleLogout()
                        }}
                    >
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Đăng xuất
                    </MenuItem>
                </>
            ) : (
                <>
                    <MenuItem
                        onClick={() => {
                            handleMenuClose()
                            navigate("/login")
                        }}
                    >
                        <ListItemIcon>
                            <Login fontSize="small" />
                        </ListItemIcon>
                        Đăng nhập
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMenuClose()
                            navigate("/register")
                        }}
                    >
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Đăng ký
                    </MenuItem>
                </>
            )}
        </Menu>
    )

    const drawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                <ListItem button component={RouterLink} to="/">
                    <ListItemIcon>
                        <Home />
                    </ListItemIcon>
                    <ListItemText primary="Trang chủ" />
                </ListItem>
                <ListItem button component={RouterLink} to="/products">
                    <ListItemIcon>
                        <ShoppingCart />
                    </ListItemIcon>
                    <ListItemText primary="Sản phẩm" />
                </ListItem>
            </List>
            <Divider />
            {isAdmin && (
                <List>
                    <ListItem button component={RouterLink} to="/admin/products">
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý sản phẩm" />
                    </ListItem>
                    <ListItem button component={RouterLink} to="/admin/categories">
                        <ListItemIcon>
                            <Category />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý danh mục" />
                    </ListItem>
                </List>
            )}
        </Box>
    )

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.main" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {isMobile && (
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            WEBSHOP
                        </Typography>

                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".2rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            WEBSHOP
                        </Typography>

                        {!isMobile && (
                            <>
                                <Button color="inherit" component={RouterLink} to="/">
                                    Trang chủ
                                </Button>
                                <Button color="inherit" component={RouterLink} to="/products">
                                    Sản phẩm
                                </Button>
                            </>
                        )}

                        <SearchBox>
                            <SearchIconWrapper>
                                <Search />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Tìm kiếm..." inputProps={{ "aria-label": "search" }} />
                        </SearchBox>

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: "flex" }}>
                            <IconButton size="large" color="inherit" component={RouterLink} to="/cart">
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <Person />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {renderMenu}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerList}
            </Drawer>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Navbar