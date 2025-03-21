import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../utils/api";
import AuthForm from "../components/AuthForm";
import { Container, Box, Typography, Paper, Link as MuiLink } from "@mui/material";

const Login = () => {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await login(data);
            if (response.status === 200) {
                // Lưu token và vai trò vào localStorage
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("roles", JSON.stringify(response.data.userRes.roleNames || []));
                localStorage.setItem("userId", response.data.userRes.id);
                navigate("/", {
                    state: {
                        snackbar: {
                            open: true,
                            message: "Đăng nhập thành công!",
                            severity: "success",
                        },
                    },
                });
            }
        } catch (error) {
            alert("Đăng nhập thất bại: " + (error.response?.data?.message || error.message));
        }
    };

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
                    Đăng nhập
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    Đăng nhập để tiếp tục
                </Typography>

                <Paper elevation={3} sx={{ p: 4, mt: 3, width: "100%" }}>
                    <AuthForm onSubmit={onSubmit} isRegister={false} />

                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography variant="body2">
                            Chưa có tài khoản?{" "}
                            <MuiLink component={Link} to="/register" underline="hover">
                                Đăng ký
                            </MuiLink>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;