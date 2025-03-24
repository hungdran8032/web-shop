/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Breadcrumbs,
    Link,
    Alert,
    Snackbar,
    CircularProgress,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCartItemsByUser, createOrder } from "../utils/api";

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        shippingAddress: "",
        phoneNumber: "",
        paymentMethod: "CASH",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const loadCart = async () => {
            if (!userId) {
                setSnackbar({
                    open: true,
                    message: "Vui lòng đăng nhập để thanh toán!",
                    severity: "error",
                });
                navigate("/login");
                return;
            }

            try {
                const data = await getCartItemsByUser(userId);
                setCartItems(data || []);
                setLoading(false);
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: "Lỗi khi tải giỏ hàng: " + (err.response?.data?.message || err.message),
                    severity: "error",
                });
                setLoading(false);
            }
        };

        loadCart();
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!formData.shippingAddress || !formData.phoneNumber) {
            setSnackbar({
                open: true,
                message: "Vui lòng điền đầy đủ thông tin giao hàng!",
                severity: "error",
            });
            return;
        }

        const orderData = {
            shippingAddress: formData.shippingAddress,
            phoneNumber: formData.phoneNumber,
            orderDetails: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        try {
            const jwt = `Bearer ${localStorage.getItem("accessToken")}`;
            const response = await createOrder(orderData, jwt);
            setSnackbar({
                open: true,
                message: "Đặt hàng thành công!",
                severity: "success",
            });
            setTimeout(() => {
                navigate(`/order/${response.orderId}`);
            }, 2000);
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Lỗi khi đặt hàng: " + (err.response?.data?.message || err.message),
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };

    // Tính toán tổng tiền
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const shippingFee = subtotal > 0 ? 30000 : 0;
    const total = subtotal + shippingFee;

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
                    <Link underline="hover" color="inherit" href="/">
                        Trang chủ
                    </Link>
                    <Link underline="hover" color="inherit" href="/cart">
                        Giỏ hàng
                    </Link>
                    <Typography color="text.primary">Thanh toán</Typography>
                </Breadcrumbs>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                    Thanh toán
                </Typography>

                {cartItems.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6">Giỏ hàng của bạn trống</Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => navigate("/products")}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={4}>
                        {/* Thông tin giao hàng */}
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Thông tin giao hàng
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <TextField
                                        label="Địa chỉ giao hàng"
                                        name="shippingAddress"
                                        value={formData.shippingAddress}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Số điện thoại"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                    />

                                </Box>
                            </Paper>
                        </Grid>

                        {/* Tóm tắt đơn hàng */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Tóm tắt đơn hàng
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sản phẩm</TableCell>
                                                <TableCell align="right">Thành tiền</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cartItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        {item.productName} (x{item.quantity})
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {item.price.toLocaleString()} VNĐ
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell>Tạm tính</TableCell>
                                                <TableCell align="right">
                                                    {subtotal.toLocaleString()} VNĐ
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Phí vận chuyển</TableCell>
                                                <TableCell align="right">
                                                    {shippingFee.toLocaleString()} VNĐ
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <strong>Tổng cộng</strong>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <strong>{total.toLocaleString()} VNĐ</strong>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    onClick={handlePlaceOrder}
                                >
                                    Đặt hàng
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
            <Footer />
        </Box>
    );
};

export default Checkout;