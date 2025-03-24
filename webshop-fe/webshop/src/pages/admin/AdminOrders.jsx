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
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getOrders, updateOrderStatus } from "../../utils/api";

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");
        if (!roles.includes("ADMIN")) {
            navigate("/");
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, { typeOrderStatus: newStatus });
            setOrders((prev) =>
                prev.map((order) =>
                    order.orderId === orderId ? { ...order, typeOrderStatus: newStatus } : order
                )
            );
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                    Quản lý đơn hàng
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã đơn hàng</TableCell>
                                <TableCell>Khách hàng</TableCell>
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
                                    <TableCell>{order.userId}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {order.totalPrice.toLocaleString()} VNĐ
                                    </TableCell>
                                    <TableCell>
                                        <FormControl sx={{ minWidth: 120 }}>
                                            <InputLabel>Trạng thái</InputLabel>
                                            <Select
                                                value={order.typeOrderStatus}
                                                onChange={(e) =>
                                                    handleStatusChange(order.orderId, e.target.value)
                                                }
                                                label="Trạng thái"
                                            >
                                                <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                                                <MenuItem value="DELIVERING">Đang giao</MenuItem>
                                                <MenuItem value="DELIVERED">Đã giao</MenuItem>
                                                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(`/admin/order/${order.orderId}`)}
                                        >
                                            Chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Footer />
        </Box>
    );
};

export default AdminOrders;