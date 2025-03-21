/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Button,
    Container,
    Rating,
    IconButton,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
    Paper,
    Divider,
    useTheme,
    useMediaQuery,
    Stack,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getProducts } from "../utils/api"
import { ShoppingCart, Favorite, FavoriteBorder, FilterList } from "@mui/icons-material"

const ProductList = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const isTablet = useMediaQuery(theme.breakpoints.down("md"))

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState("newest")
    const [favorites, setFavorites] = useState([])
    const [hoveredProduct, setHoveredProduct] = useState(null)

    const navigate = useNavigate()

    const productsPerPage = 12
    const totalPages = Math.ceil((products.length || 0) / productsPerPage)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const productsData = await getProducts()
                setProducts(productsData || [])

                // Load favorites from localStorage
                const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
                setFavorites(savedFavorites)

                setLoading(false)
            } catch (err) {
                setError("Không thể tải danh sách sản phẩm")
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`)
    }

    const handleAddToCart = (e, product) => {
        e.stopPropagation()
        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")

        // Check if product already in cart
        const existingProductIndex = cart.findIndex((item) => item.id === product.id)

        if (existingProductIndex >= 0) {
            // Update quantity if product exists
            cart[existingProductIndex].quantity += 1
        } else {
            // Add new product to cart
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1,
            })
        }

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart))

        // Show success message
        alert("Đã thêm sản phẩm vào giỏ hàng!")
    }

    const toggleFavorite = (e, productId) => {
        e.stopPropagation()

        let newFavorites
        if (favorites.includes(productId)) {
            newFavorites = favorites.filter((id) => id !== productId)
        } else {
            newFavorites = [...favorites, productId]
        }

        setFavorites(newFavorites)
        localStorage.setItem("favorites", JSON.stringify(newFavorites))
    }

    const handleSortChange = (event) => {
        setSortBy(event.target.value)
    }

    const handlePageChange = (event, value) => {
        setPage(value)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Sort products based on selected option
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case "priceAsc":
                return (a.price || 0) - (b.price || 0)
            case "priceDesc":
                return (b.price || 0) - (a.price || 0)
            case "nameAsc":
                return a.name.localeCompare(b.name)
            case "nameDesc":
                return b.name.localeCompare(a.name)
            case "newest":
            default:
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        }
    })

    // Paginate products
    const paginatedProducts = sortedProducts.slice((page - 1) * productsPerPage, page * productsPerPage)

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4" component="h1">
                        Sản phẩm
                    </Typography>
                    <Skeleton variant="rectangular" width={200} height={40} />
                </Box>
                <Grid container spacing={3}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                    ))}
                </Grid>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="error" variant="h6">
                        {error}
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </Paper>
            </Container>
        )
    }

    if (products.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Không có sản phẩm nào để hiển thị.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate("/")}>
                        Quay lại trang chủ
                    </Button>
                </Paper>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
                sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
            >
                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                    Sản phẩm
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {!isMobile && (
                        <Button
                            startIcon={<FilterList />}
                            variant="outlined"
                            onClick={() => alert("Tính năng lọc sẽ được phát triển sau")}
                        >
                            Lọc
                        </Button>
                    )}

                    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="sort-select-label">Sắp xếp theo</InputLabel>
                        <Select labelId="sort-select-label" value={sortBy} onChange={handleSortChange} label="Sắp xếp theo">
                            <MenuItem value="newest">Mới nhất</MenuItem>
                            <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
                            <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
                            <MenuItem value="nameAsc">Tên A-Z</MenuItem>
                            <MenuItem value="nameDesc">Tên Z-A</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                                position: "relative",
                                cursor: "pointer",
                            }}
                            onClick={() => handleViewDetails(product.id)}
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            <Box sx={{ position: "relative" }}>
                                <CardMedia
                                    component="img"
                                    height={200}
                                    image={product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                                    alt={product.name}
                                    sx={{ objectFit: "cover" }}
                                />

                                {/* Favorite button */}
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        bgcolor: "rgba(255,255,255,0.8)",
                                        "&:hover": {
                                            bgcolor: "rgba(255,255,255,0.9)",
                                        },
                                    }}
                                    onClick={(e) => toggleFavorite(e, product.id)}
                                >
                                    {favorites.includes(product.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                                </IconButton>

                                {/* Sale badge if needed */}
                                {product.discount && (
                                    <Chip
                                        label={`-${product.discount}%`}
                                        color="error"
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            left: 8,
                                            fontWeight: "bold",
                                        }}
                                    />
                                )}
                            </Box>

                            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                {product.category && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                        {product.category.name}
                                    </Typography>
                                )}

                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: "medium",
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

                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                    <Rating value={product.rating || 4.5} precision={0.5} size="small" readOnly />
                                    <Typography variant="body2" color="text.secondary">
                                        ({product.reviewCount || 0})
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {product.description || "Không có mô tả"}
                                </Typography>

                                <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                                    {product.price ? `${product.price.toLocaleString()} VNĐ` : "Liên hệ"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Còn lại: {product.quantity || 0}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<ShoppingCart />}
                                    onClick={(e) => handleAddToCart(e, product)}
                                    disabled={product.quantity <= 0}
                                >
                                    {product.quantity <= 0 ? "Hết hàng" : "Thêm vào giỏ"}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                    />
                </Box>
            )}
        </Container>
    )
}

export default ProductList

