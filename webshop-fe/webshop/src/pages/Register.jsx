

import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { register } from "../utils/api"
import AuthForm from "../components/AuthForm"
import { Container, Box, Typography, Paper, Link as MuiLink } from "@mui/material"

const Register = () => {
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            const response = await register(data)
            if (response.status === 200) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.")
                navigate("/login")
            }
        } catch (error) {
            alert("Đăng ký thất bại: " + (error.response?.data?.message || error.message))
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Tạo tài khoản mới
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    Đăng ký để trải nghiệm dịch vụ của chúng tôi
                </Typography>

                <Paper elevation={3} sx={{ p: 4, mt: 3, width: "100%" }}>
                    <AuthForm onSubmit={onSubmit} isRegister={true} />

                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography variant="body2">
                            Đã có tài khoản?{" "}
                            <MuiLink component={Link} to="/login" underline="hover">
                                Đăng nhập
                            </MuiLink>
                        </Typography>
                    </Box>
                </Paper>

                <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 3 }}>
                    Bằng việc đăng ký, bạn đồng ý với các điều khoản dịch vụ của chúng tôi
                </Typography>
            </Box>
        </Container>
    )
}

export default Register

