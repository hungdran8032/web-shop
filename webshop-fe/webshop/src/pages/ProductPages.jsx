

import { Box, Container, Typography, Breadcrumbs, Link } from "@mui/material"
import { NavigateNext } from "@mui/icons-material"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductList from "../components/ProductList"

const ProductsPage = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Box sx={{ bgcolor: "background.default", flexGrow: 1 }}>
                <Container maxWidth="lg" sx={{ pt: 3 }}>
                    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <Link underline="hover" color="inherit" href="/">
                            Trang chủ
                        </Link>
                        <Typography color="text.primary">Sản phẩm</Typography>
                    </Breadcrumbs>

                    <ProductList />
                </Container>
            </Box>
            <Footer />
        </Box>
    )
}

export default ProductsPage;

