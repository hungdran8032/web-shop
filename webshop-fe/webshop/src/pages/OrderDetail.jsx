/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Breadcrumbs,
    Link,
    Chip,
    CircularProgress,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrderByIdForUser } from "../utils/api";

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchOrder = async () => {
            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const response = await getOrderByIdForUser(orderId, userId);
                setOrder(response);

            } catch (err) {
                console.error("Error fetching order:", err);

            }
        };

        fetchOrder();
    }, [orderId, userId, navigate]);



    if (!order) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Typography color="error">Không tìm thấy đơn hàng</Typography>
                </Container>
                <Footer />
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
                    <Link underline="hover" color="inherit" href="/orders">
                        Đơn hàng
                    </Link>
                    <Typography color="text.primary">#{order.orderId}</Typography>
                </Breadcrumbs>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                    Chi tiết đơn hàng #{order.orderId}
                </Typography>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h6">
                            Trạng thái: <Chip label={order.typeOrderStatus} color="primary" />
                        </Typography>
                        <Typography variant="body1">
                            Ngày đặt: {new Date(order.createAt).toLocaleString()}
                        </Typography>
                    </Box>

                    <Typography variant="body1" gutterBottom>
                        Địa chỉ giao hàng: {order.shippingAddress}
                    </Typography>
                    <Typography variant="body1">Số điện thoại: {order.phoneNumber}</Typography>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell align="center">Số lượng</TableCell>
                                <TableCell align="right">Đơn giá</TableCell>
                                <TableCell align="right">Thành tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderDetails.map((item) => (
                                <TableRow key={item.productId}>
                                    <TableCell>{item.productId}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">
                                        {(item.price / item.quantity).toLocaleString()} VNĐ
                                    </TableCell>
                                    <TableCell align="right">{item.price.toLocaleString()} VNĐ</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} align="right">
                                    <strong>Tổng cộng:</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <strong>{order.totalPrice.toLocaleString()} VNĐ</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Footer />
        </Box>
    );
};

export default OrderDetail;