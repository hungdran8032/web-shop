/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Chip,
    Paper,
    Divider,
    Rating,
    TextField,
    IconButton,
    Breadcrumbs,
    Link,
    Tabs,
    Tab,
    Skeleton,
    Stack,
    Alert,
    Snackbar,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";
import {
    ShoppingCart,
    Favorite,
    FavoriteBorder,
    Share,
    LocalShipping,
    Security,
    Replay,
    Add,
    Remove,
    NavigateNext,
} from "@mui/icons-material";
import { getProductById, createCartItem } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productData = await getProductById(id);
                setProduct(productData);

                // Check if product is in favorites
                const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
                setIsFavorite(favorites.includes(productData.id));

                setLoading(false);
            } catch (err) {
                setError("Không thể tải thông tin sản phẩm");
                setLoading(false);
            }
        };

        fetchProduct();
        setQuantity(1);
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        const userId = JSON.parse(localStorage.getItem("userId"));
        if (!userId) {
            setSnackbar({
                open: true,
                message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
                severity: "error",
            });
            navigate("/login");
            return;
        }

        try {
            const cartItemData = {
                userId: userId,
                productId: product.id,
                quantity: quantity,
            };
            await createCartItem(cartItemData);
            setSnackbar({
                open: true,
                message: "Đã thêm sản phẩm vào giỏ hàng!",
                severity: "success",
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Lỗi khi thêm vào giỏ hàng: " + (err.response?.data?.message || err.message),
                severity: "error",
            });
        }
    };

    const handleQuantityChange = (event) => {
        const value = Number.parseInt(event.target.value);
        if (!isNaN(value) && value > 0 && value <= (product?.quantity || 1)) {
            setQuantity(value);
        }
    };

    const increaseQuantity = () => {
        if (quantity < (product?.quantity || 1)) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

        let newFavorites;
        if (isFavorite) {
            newFavorites = favorites.filter((favId) => favId !== product.id);
            setSnackbar({
                open: true,
                message: "Đã xóa khỏi danh sách yêu thích",
                severity: "info",
            });
        } else {
            newFavorites = [...favorites, product.id];
            setSnackbar({
                open: true,
                message: "Đã thêm vào danh sách yêu thích",
                severity: "success",
            });
        }

        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                    <Skeleton variant="text" width={300} height={30} sx={{ mb: 2 }} />

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Skeleton variant="rectangular" width="100%" height={400} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
                            <Skeleton variant="text" width="30%" sx={{ mb: 3 }} />
                            <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={50} />
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                        <Typography color="error" variant="h6" gutterBottom>
                            {error || "Sản phẩm không tồn tại"}
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/products")} sx={{ mt: 2 }}>
                            Quay lại danh sách sản phẩm
                        </Button>
                    </Paper>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
                    <Link underline="hover" color="inherit" href="/">
                        Trang chủ
                    </Link>
                    <Link underline="hover" color="inherit" href="/products">
                        Sản phẩm
                    </Link>
                    {product.category && (
                        <Link underline="hover" color="inherit" href={`/category/${product.category.id}`}>
                            {product.category.name}
                        </Link>
                    )}
                    <Typography color="text.primary">{product.name}</Typography>
                </Breadcrumbs>

                <Grid container spacing={4}>
                    {/* Product Image */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                overflow: "hidden",
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <Box
                                component="img"
                                src={product.imageUrl || "https://via.placeholder.com/600x600?text=No+Image"}
                                alt={product.name}
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "500px",
                                    objectFit: "contain",
                                    display: "block",
                                    p: 2,
                                }}
                            />
                        </Paper>
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                                {product.name}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Rating value={product.rating || 4.5} precision={0.5} readOnly />
                                <Typography variant="body2" color="text.secondary">
                                    ({product.reviewCount || 0} đánh giá)
                                </Typography>
                            </Stack>

                            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: "bold" }}>
                                {product.price ? `${product.price.toLocaleString()} VNĐ` : "Liên hệ"}
                            </Typography>

                            {product.discount && (
                                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                                    <Typography variant="body1" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                                        {((product.price * 100) / (100 - product.discount)).toLocaleString()} VNĐ
                                    </Typography>
                                    <Chip label={`-${product.discount}%`} color="error" size="small" />
                                </Box>
                            )}

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Tình trạng:{" "}
                                <Chip
                                    label={product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                                    color={product.quantity > 0 ? "success" : "error"}
                                    size="small"
                                />
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body1" color="text.secondary" paragraph>
                                {product.description || "Không có mô tả chi tiết cho sản phẩm này."}
                            </Typography>

                            {product.quantity > 0 && (
                                <Box sx={{ my: 3 }}>
                                    <Typography variant="body1" gutterBottom>
                                        Số lượng:
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <IconButton
                                            onClick={decreaseQuantity}
                                            size="small"
                                            sx={{ border: "1px solid", borderColor: "divider" }}
                                        >
                                            <Remove fontSize="small" />
                                        </IconButton>
                                        <TextField
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            inputProps={{
                                                min: 1,
                                                max: product.quantity,
                                                style: { textAlign: "center" },
                                            }}
                                            variant="outlined"
                                            size="small"
                                            sx={{ width: "70px", mx: 1 }}
                                        />
                                        <IconButton
                                            onClick={increaseQuantity}
                                            size="small"
                                            sx={{ border: "1px solid", borderColor: "divider" }}
                                        >
                                            <Add fontSize="small" />
                                        </IconButton>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                            {product.quantity} sản phẩm có sẵn
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            startIcon={<ShoppingCart />}
                                            onClick={handleAddToCart}
                                            sx={{ flex: { xs: "1 0 100%", sm: "1 0 auto" }, mb: { xs: 1, sm: 0 } }}
                                        >
                                            Thêm vào giỏ hàng
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                            startIcon={isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                                            onClick={toggleFavorite}
                                        >
                                            Yêu thích
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                            startIcon={<Share />}
                                            onClick={() => alert("Tính năng chia sẻ sẽ được phát triển sau")}
                                        >
                                            Chia sẻ
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            {/* Product benefits */}
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <LocalShipping color="primary" />
                                        <Typography variant="body2">Giao hàng miễn phí</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Security color="primary" />
                                        <Typography variant="body2">Bảo hành 12 tháng</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Replay color="primary" />
                                        <Typography variant="body2">Đổi trả trong 7 ngày</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                {/* Product tabs */}
                <Box sx={{ mt: 6, mb: 4 }}>
                    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                            <Tab label="Mô tả chi tiết" />
                            <Tab label="Thông số kỹ thuật" />
                            <Tab label="Đánh giá (0)" />
                        </Tabs>

                        <Divider />

                        <Box sx={{ p: 3 }}>
                            {activeTab === 0 && (
                                <Typography variant="body1">
                                    {product.description || "Không có mô tả chi tiết cho sản phẩm này."}
                                </Typography>
                            )}

                            {activeTab === 1 && (
                                <Box>
                                    {product.specifications ? (
                                        <Grid container spacing={2}>
                                            {Object.entries(product.specifications).map(([key, value]) => (
                                                <Grid item xs={12} key={key}>
                                                    <Box sx={{ display: "flex", py: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: "medium", width: "30%" }}>
                                                            {key}:
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ width: "70%" }}>
                                                            {value}
                                                        </Typography>
                                                    </Box>
                                                    <Divider />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Typography>Không có thông số kỹ thuật cho sản phẩm này.</Typography>
                                    )}
                                </Box>
                            )}

                            {activeTab === 2 && (
                                <Box>
                                    <Typography variant="body1" gutterBottom>
                                        Chưa có đánh giá nào cho sản phẩm này.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => alert("Tính năng đánh giá sẽ được phát triển sau")}
                                    >
                                        Viết đánh giá
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>

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
    );
};

export default ProductDetail;