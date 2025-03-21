/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Divider,
    IconButton,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    Alert,
    Snackbar,
} from "@mui/material"
import {
    Add,
    Remove,
    Delete,
    NavigateNext,
    ShoppingCart,
    LocalShipping,
    Payment,
    CheckCircle,
} from "@mui/icons-material"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getCartItemsByUser, updateCartItemQuantity, deleteCartItem } from "../utils/api"

const Cart = () => {
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [couponCode, setCouponCode] = useState("")
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    })

    // Lấy userId từ localStorage
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        const loadCart = async () => {
            if (!userId) {
                setSnackbar({
                    open: true,
                    message: "Vui lòng đăng nhập để xem giỏ hàng!",
                    severity: "error",
                })
                navigate('/login')
                setLoading(false)
                return
            }

            try {
                const data = await getCartItemsByUser(userId)
                setCartItems(data)
                setLoading(false)
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: "Lỗi khi lấy giỏ hàng: " + (err.response?.data?.message || err.message),
                    severity: "error",
                })
                setLoading(false)
            }
        }

        loadCart()
    }, [userId, navigate])

    const handleQuantityChange = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        // Tìm sản phẩm trong giỏ hàng
        const item = cartItems.find((item) => item.id === id);
        if (!item) return;

        // Kiểm tra số lượng tồn kho
        if (newQuantity > item.stock) {
            setSnackbar({
                open: true,
                message: `Số lượng vượt quá tồn kho! Tồn kho hiện tại: ${item.stock}`,
                severity: "error",
            });
            return;
        }

        try {
            const updatedItem = await updateCartItemQuantity(id, newQuantity);
            setCartItems(cartItems.map((item) => (item.id === id ? updatedItem : item)));
            setSnackbar({
                open: true,
                message: "Cập nhật số lượng thành công!",
                severity: "success",
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Lỗi khi cập nhật số lượng: " + (err.response?.data?.message || err.message),
                severity: "error",
            });
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await deleteCartItem(id)
            setCartItems(cartItems.filter((item) => item.id !== id))
            setSnackbar({
                open: true,
                message: "Đã xóa sản phẩm khỏi giỏ hàng",
                severity: "success",
            })
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Lỗi khi xóa sản phẩm: " + (err.response?.data?.message || err.message),
                severity: "error",
            })
        }
    }

    const handleClearCart = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")) {
            try {
                // Xóa từng CartItem
                await Promise.all(cartItems.map(item => deleteCartItem(item.id)))
                setCartItems([])
                setSnackbar({
                    open: true,
                    message: "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
                    severity: "info",
                })
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: "Lỗi khi xóa giỏ hàng: " + (err.response?.data?.message || err.message),
                    severity: "error",
                })
            }
        }
    }

    const handleApplyCoupon = () => {
        if (!couponCode) {
            setSnackbar({
                open: true,
                message: "Vui lòng nhập mã giảm giá",
                severity: "error",
            })
            return
        }

        // Mock coupon application
        if (couponCode === "DISCOUNT10") {
            setSnackbar({
                open: true,
                message: "Áp dụng mã giảm giá thành công!",
                severity: "success",
            })
        } else {
            setSnackbar({
                open: true,
                message: "Mã giảm giá không hợp lệ",
                severity: "error",
            })
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setSnackbar({ ...snackbar, open: false })
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0) // item.price đã là tổng giá (price * quantity)
    const shipping = subtotal > 0 ? 30000 : 0 // Free shipping over a certain amount
    const discount = couponCode === "DISCOUNT10" ? subtotal * 0.1 : 0
    const total = subtotal + shipping - discount

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
                    <Link underline="hover" color="inherit" href="/">
                        Trang chủ
                    </Link>
                    <Typography color="text.primary">Giỏ hàng</Typography>
                </Breadcrumbs>

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Giỏ hàng của bạn
                </Typography>

                {cartItems.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
                        <ShoppingCart sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Giỏ hàng của bạn đang trống
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate("/products")}
                            sx={{ mt: 2 }}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={4}>
                        {/* Cart Items */}
                        <Grid item xs={12} md={8}>
                            <TableContainer component={Paper} sx={{ mb: 3 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell align="center">Giá</TableCell>
                                            <TableCell align="center">Số lượng</TableCell>
                                            <TableCell align="right">Thành tiền</TableCell>
                                            <TableCell align="center">Xóa</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Box
                                                            component="img"
                                                            src={item.image || "https://via.placeholder.com/80x80?text=No+Image"}
                                                            alt={item.productName}
                                                            sx={{ width: 80, height: 80, objectFit: "cover", mr: 2, borderRadius: 1 }}
                                                        />
                                                        <Typography variant="body1">{item.productName}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{(item.price / item.quantity).toLocaleString()} VNĐ</TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Remove fontSize="small" />
                                                        </IconButton>
                                                        <TextField
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const value = Number.parseInt(e.target.value)
                                                                if (!isNaN(value) && value > 0) {
                                                                    handleQuantityChange(item.id, value)
                                                                }
                                                            }}
                                                            inputProps={{
                                                                min: 1,
                                                                style: { textAlign: "center" },
                                                            }}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ width: "60px", mx: 1 }}
                                                        />
                                                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{(item.price).toLocaleString()} VNĐ</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                                <Button variant="outlined" onClick={() => navigate("/products")}>
                                    Tiếp tục mua sắm
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleClearCart}>
                                    Xóa giỏ hàng
                                </Button>
                            </Box>

                            {/* Coupon Code */}
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Mã giảm giá
                                </Typography>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <TextField
                                        placeholder="Nhập mã giảm giá"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        size="small"
                                        fullWidth
                                    />
                                    <Button variant="contained" onClick={handleApplyCoupon}>
                                        Áp dụng
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Order Summary */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tóm tắt đơn hàng
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="body1">Tạm tính:</Typography>
                                        <Typography variant="body1">{subtotal.toLocaleString()} VNĐ</Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="body1">Phí vận chuyển:</Typography>
                                        <Typography variant="body1">{shipping.toLocaleString()} VNĐ</Typography>
                                    </Box>

                                    {discount > 0 && (
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="body1">Giảm giá:</Typography>
                                            <Typography variant="body1" color="error">
                                                -{discount.toLocaleString()} VNĐ
                                            </Typography>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                        <Typography variant="h6">Tổng cộng:</Typography>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                            {total.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        onClick={() => navigate("/checkout")}
                                    >
                                        Tiến hành thanh toán
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Shipping Info */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin vận chuyển
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <LocalShipping color="primary" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="body1">Giao hàng tiêu chuẩn</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                2-3 ngày làm việc
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Payment color="primary" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="body1">Thanh toán an toàn</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hỗ trợ nhiều phương thức thanh toán
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <CheckCircle color="primary" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="body1">Chính sách đổi trả</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Đổi trả trong vòng 7 ngày
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
            <Footer />
        </Box>
    )
}

export default Cart