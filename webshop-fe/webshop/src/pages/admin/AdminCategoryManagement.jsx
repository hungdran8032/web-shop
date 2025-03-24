/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../utils/api";

const AdminCategoryManagement = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });

    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");
        if (!roles.includes("ADMIN")) {
            navigate("/");
            return; // Chuyển hướng nếu không phải admin
        }

        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData || []);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải danh sách danh mục");
                setLoading(false);
            }
        };

        fetchCategories();
    }, [navigate]);

    const handleOpenDialog = (category = null) => {
        if (category) {
            setIsEditMode(true);
            setCurrentCategory(category);
            setFormData({
                name: category.name,
            });
        } else {
            setIsEditMode(false);
            setCurrentCategory(null);
            setFormData({
                name: "",
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditMode && currentCategory) {
                const updatedCategory = await updateCategory(currentCategory.id, formData);
                setCategories((prev) =>
                    prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
                );
                alert("Cập nhật danh mục thành công!");
            } else {
                const newCategory = await createCategory(formData);
                setCategories((prev) => [...prev, newCategory]);
                alert("Thêm danh mục thành công!");
            }
            handleCloseDialog();
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await deleteCategory(id);
                setCategories((prev) => prev.filter((c) => c.id !== id));
                alert("Xóa danh mục thành công!");
            } catch (err) {
                alert("Lỗi: " + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Navbar */}
            <Navbar />

            {/* Body */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Quản Lý Danh Mục
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                    sx={{ mb: 3 }}
                >
                    Thêm Danh Mục
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên Danh Mục</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpenDialog(category)}
                                            sx={{ mr: 1 }}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog để thêm/sửa danh mục */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{isEditMode ? "Cập Nhật Danh Mục" : "Thêm Danh Mục"}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                            <TextField
                                label="Tên danh mục"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} color="primary" variant="contained">
                            {isEditMode ? "Cập nhật" : "Thêm"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

            {/* Footer */}
            <Footer />
        </Box>
    );
};

export default AdminCategoryManagement;