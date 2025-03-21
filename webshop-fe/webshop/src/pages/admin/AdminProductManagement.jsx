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
    Chip,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "../../utils/api";

const AdminProductManagement = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");
        if (!roles.includes("ADMIN")) {
            navigate("/"); // Chuyển hướng nếu không phải admin
        }

        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories(),
                ]);
                setProducts(productsData || []);
                setCategories(categoriesData || []);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải dữ liệu");
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleOpenDialog = (product = null) => {
        if (product) {
            setIsEditMode(true);
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                categoryId: product.category ? product.category.id : "",
            });
        } else {
            setIsEditMode(false);
            setCurrentProduct(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                quantity: "",
                categoryId: "",
            });
        }
        setFile(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            if (isEditMode && currentProduct) {
                const updatedProduct = await updateProduct(currentProduct.id, formData, file);
                setProducts((prev) =>
                    prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                );
                alert("Cập nhật sản phẩm thành công!");
            } else {
                const newProduct = await createProduct(formData, file);
                setProducts((prev) => [...prev, newProduct]);
                alert("Thêm sản phẩm thành công!");
            }
            handleCloseDialog();
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await deleteProduct(id);
                setProducts((prev) => prev.filter((p) => p.id !== id));
                alert("Xóa sản phẩm thành công!");
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
                    Quản Lý Sản Phẩm
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                    sx={{ mb: 3 }}
                >
                    Thêm Sản Phẩm
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Box
                                            component="img"
                                            src={product.imageUrl || "https://via.placeholder.com/50"}
                                            alt={product.name}
                                            sx={{ width: 50, height: 50, objectFit: "cover" }}
                                        />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description || "Không có mô tả"}</TableCell>
                                    <TableCell>{product.price ? `${product.price.toLocaleString()} VNĐ` : "Liên hệ"}</TableCell>
                                    <TableCell>{product.quantity || 0}</TableCell>
                                    <TableCell>
                                        {product.category ? (
                                            <Chip label={product.category.name} size="small" color="secondary" />
                                        ) : (
                                            "Không có danh mục"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpenDialog(product)}
                                            sx={{ mr: 1 }}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog để thêm/sửa sản phẩm */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{isEditMode ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm"}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                            <TextField
                                label="Tên sản phẩm"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Mô tả"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={3}
                            />
                            <TextField
                                label="Giá"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Số lượng"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <FormControl fullWidth required>
                                <InputLabel id="category-select-label">Danh mục</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    label="Danh mục"
                                    onChange={handleInputChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Hình ảnh"
                                type="file"
                                onChange={handleFileChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ accept: "image/*" }}
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

export default AdminProductManagement;