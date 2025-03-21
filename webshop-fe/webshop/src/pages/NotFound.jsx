

import { Box, Container, Typography, Button, Paper } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 8, mb: 8, flexGrow: 1 }}>
                <Paper sx={{ p: 6, textAlign: "center" }}>
                    <Typography variant="h1" sx={{ fontSize: "8rem", fontWeight: "bold", color: "primary.main" }}>
                        404
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        Trang không tồn tại
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    </Typography>
                    <Button variant="contained" color="primary" size="large" onClick={() => navigate("/")} sx={{ mt: 2 }}>
                        Quay lại trang chủ
                    </Button>
                </Paper>
            </Container>
            <Footer />
        </Box>
    )
}

export default NotFound;

