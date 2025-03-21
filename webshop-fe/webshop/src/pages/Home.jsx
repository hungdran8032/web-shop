/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Paper,
    useTheme,
    useMediaQuery,
    Skeleton,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { ArrowForward, ShoppingCart } from "@mui/icons-material"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getProducts, getCategories } from "../utils/api"

const Home = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const navigate = useNavigate()

    const [featuredProducts, setFeaturedProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()])

                // Get featured products (first 8)
                setFeaturedProducts(productsData?.slice(0, 8) || [])
                setCategories(categoriesData || [])
                setLoading(false)
            } catch (err) {
                console.error("Error fetching data:", err)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />

            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    py: { xs: 6, md: 10 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "2rem", md: "3rem" },
                                }}
                            >
                                Mua sắm trực tuyến dễ dàng và tiện lợi
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, fontWeight: "normal" }}>
                                Khám phá hàng ngàn sản phẩm chất lượng cao với giá cả hợp lý. Giao hàng nhanh chóng và đảm bảo.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={() => navigate("/products")}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: "bold",
                                        flex: { xs: "1 0 100%", sm: "0 0 auto" },
                                        mb: { xs: 2, sm: 0 },
                                    }}
                                >
                                    Mua sắm ngay
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="large"
                                    onClick={() => navigate("/about")}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderColor: "white",
                                        "&:hover": {
                                            borderColor: "white",
                                            bgcolor: "rgba(255, 255, 255, 0.1)",
                                        },
                                        flex: { xs: "1 0 100%", sm: "0 0 auto" },
                                    }}
                                >
                                    Tìm hiểu thêm
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
                            <Box
                                component="img"
                                src="https://st2.depositphotos.com/5482604/8042/i/950/depositphotos_80420880-stock-illustration-cat-working-as-a-cashier.jpg"
                                alt="Shopping"
                                sx={{
                                    width: "100%",
                                    borderRadius: 4,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Featured Categories */}
            <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
                <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
                        Danh mục nổi bật
                    </Typography>
                    <Button endIcon={<ArrowForward />} onClick={() => navigate("/products")}>
                        Xem tất cả
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {loading
                        ? // Loading skeleton
                        [...Array(4)].map((_, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 1 }} />
                                <Skeleton variant="text" width="60%" />
                            </Grid>
                        ))
                        : // Actual categories
                        categories
                            .slice(0, 4)
                            .map((category, index) => (
                                <Grid item xs={6} sm={3} key={category.id || index}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            height: 100,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                            },
                                            bgcolor: `${index % 2 === 0 ? "primary.light" : "secondary.light"}`,
                                            color: "white",
                                        }}
                                        onClick={() => navigate(`/category/${category.id}`)}
                                    >
                                        <Typography variant="h6" align="center">
                                            {category.name}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                </Grid>
            </Container>

            {/* Featured Products */}
            <Box sx={{ bgcolor: "background.default", py: 6 }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
                            Sản phẩm nổi bật
                        </Typography>
                        <Button endIcon={<ArrowForward />} onClick={() => navigate("/products")}>
                            Xem tất cả
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {loading
                            ? // Loading skeleton
                            [...Array(8)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card>
                                        <Skeleton variant="rectangular" height={200} />
                                        <CardContent>
                                            <Skeleton variant="text" height={30} />
                                            <Skeleton variant="text" />
                                            <Skeleton variant="text" width="60%" />
                                        </CardContent>
                                        <CardActions>
                                            <Skeleton variant="rectangular" width={120} height={36} />
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                            : // Actual products
                            featuredProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={3} key={product.id}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                            },
                                            cursor: "pointer",
                                        }}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        <CardMedia
                                            component="img"
                                            height={200}
                                            image={product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                                            alt={product.name}
                                            sx={{ objectFit: "cover" }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                sx={{
                                                    mb: 1,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    height: "3em",
                                                }}
                                            >
                                                {product.name}
                                            </Typography>
                                            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                                {product.price ? `${product.price.toLocaleString()} VNĐ` : "Liên hệ"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                startIcon={<ShoppingCart />}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    // Add to cart logic
                                                    alert("Đã thêm vào giỏ hàng!")
                                                }}
                                            >
                                                Thêm vào giỏ
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <Typography variant="h4" component="h2" align="center" sx={{ mb: 6, fontWeight: "bold" }}>
                    Tại sao chọn chúng tôi?
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                            <Box
                                component="img"
                                src="https://via.placeholder.com/80?text=Icon"
                                alt="Fast Shipping"
                                sx={{ width: 80, height: 80, mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Giao hàng nhanh chóng
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Giao hàng trong vòng 24h đối với nội thành và 2-3 ngày đối với các tỉnh thành khác.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                            <Box
                                component="img"
                                src="https://via.placeholder.com/80?text=Icon"
                                alt="Quality Products"
                                sx={{ width: 80, height: 80, mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Sản phẩm chất lượng
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cam kết chỉ cung cấp những sản phẩm chính hãng với chất lượng tốt nhất.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                            <Box
                                component="img"
                                src="https://via.placeholder.com/80?text=Icon"
                                alt="Secure Payment"
                                sx={{ width: 80, height: 80, mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Thanh toán an toàn
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hỗ trợ nhiều phương thức thanh toán an toàn và bảo mật thông tin khách hàng.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                            <Box
                                component="img"
                                src="https://via.placeholder.com/80?text=Icon"
                                alt="Customer Support"
                                sx={{ width: 80, height: 80, mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Hỗ trợ 24/7
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Call to Action */}
            <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                            Sẵn sàng để mua sắm?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: "normal" }}>
                            Khám phá hàng ngàn sản phẩm chất lượng cao với giá cả hợp lý ngay hôm nay.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => navigate("/products")}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: "bold",
                            }}
                        >
                            Mua sắm ngay
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Footer />
        </Box>
    )
}

export default Home

