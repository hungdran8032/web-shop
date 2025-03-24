/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Breadcrumbs,
    Link,
    Chip,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrdersByUser } from "../utils/api";

const UserOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const response = await getOrdersByUser(userId);
                setOrders(response || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate, userId]);


    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
                    <Link underline="hover" color="inherit" href="/">
                        Trang chủ
                    </Link>
                    <Typography color="text.primary">Đơn hàng của tôi</Typography>
                </Breadcrumbs>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                    Đơn hàng của tôi
                </Typography>

                {orders.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6">Bạn chưa có đơn hàng nào</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={() => navigate("/products")}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </Paper>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã đơn hàng</TableCell>
                                    <TableCell>Ngày đặt</TableCell>
                                    <TableCell>Tổng tiền</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.orderId}>
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                            {/* {order.createdAt} */}
                                        </TableCell>
                                        <TableCell>
                                            {order.totalPrice.toLocaleString()} VNĐ
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.typeOrderStatus}
                                                color={
                                                    order.typeOrderStatus === "PENDING"
                                                        ? "warning"
                                                        : order.typeOrderStatus === "DELIVERED"
                                                            ? "success"
                                                            : "default"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate(`/order/${order.orderId}`)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default UserOrders;