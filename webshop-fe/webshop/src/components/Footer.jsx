import { Box, Container, Grid, Typography, Link, IconButton, Divider, TextField, Button, Stack } from "@mui/material"
import { Facebook, Instagram, Twitter, YouTube, Email, Phone, LocationOn } from "@mui/icons-material"

const Footer = () => {
    return (
        <Box sx={{ bgcolor: "primary.main", color: "white", pt: 6, pb: 3 }} component="footer">
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            WEBSHOP
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt
                            nhất cho khách hàng.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton color="inherit" aria-label="facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" aria-label="instagram">
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" aria-label="twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" aria-label="youtube">
                                <YouTube />
                            </IconButton>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            Liên kết nhanh
                        </Typography>
                        <Link href="/" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
                            Trang chủ
                        </Link>
                        <Link href="/products" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
                            Sản phẩm
                        </Link>
                        <Link href="/about" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
                            Về chúng tôi
                        </Link>
                        <Link href="/contact" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
                            Liên hệ
                        </Link>
                        <Link href="/blog" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
                            Blog
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            Thông tin liên hệ
                        </Typography>
                        <Box sx={{ display: "flex", mb: 1 }}>
                            <LocationOn sx={{ mr: 1 }} />
                            <Typography variant="body2">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</Typography>
                        </Box>
                        <Box sx={{ display: "flex", mb: 1 }}>
                            <Phone sx={{ mr: 1 }} />
                            <Typography variant="body2">+84 123 456 789</Typography>
                        </Box>
                        <Box sx={{ display: "flex", mb: 1 }}>
                            <Email sx={{ mr: 1 }} />
                            <Typography variant="body2">info@webshop.com</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            Đăng ký nhận tin
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.
                        </Typography>
                        <Box sx={{ display: "flex" }}>
                            <TextField
                                size="small"
                                placeholder="Email của bạn"
                                variant="outlined"
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 1,
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "transparent",
                                        },
                                    },
                                }}
                            />
                            <Button variant="contained" color="secondary" sx={{ ml: 1 }}>
                                Đăng ký
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", my: 3 }} />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 } }}>
                        © {new Date().getFullYear()} Webshop. Tất cả quyền được bảo lưu.
                    </Typography>
                    <Box>
                        <Link href="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
                            Điều khoản dịch vụ
                        </Link>
                        |
                        <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
                            Chính sách bảo mật
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer

