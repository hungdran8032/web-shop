import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get("/api/v1/products");
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
};

export const createProduct = async (productData, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("product", JSON.stringify(productData));
    const response = await api.post("/api/v1/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateProduct = async (id, productData, file) => {
    const formData = new FormData();
    if (file) {
        formData.append("file", file);
    }
    formData.append("product", JSON.stringify(productData));
    const response = await api.put(`/api/v1/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/api/v1/products/${id}`);
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get("/api/v1/categories");
    return response.data;
};

export const createCategory = async (categoryData) => {
    const formData = new FormData();
    formData.append("category", JSON.stringify(categoryData));
    const response = await api.post("/api/v1/categories", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const formData = new FormData();
    formData.append("category", JSON.stringify(categoryData));
    const response = await api.put(`/api/v1/categories/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/api/v1/categories/${id}`);
    return response.data;
};

export const createCartItem = async (cartItemData) => {
    const formData = new FormData();
    formData.append("cartItem", JSON.stringify(cartItemData));
    const response = await api.post("/api/v1/cart-items", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// API để cập nhật số lượng CartItem
export const updateCartItemQuantity = async (id, quantity) => {
    const response = await api.put(`/api/v1/cart-items/${id}/quantity?quantity=${quantity}`);
    return response.data;
};

// API để lấy danh sách CartItem của user
export const getCartItemsByUser = async (userId) => {
    const response = await api.get(`/api/v1/cart-items/user/${userId}`);
    return response.data;
};

// API để xóa CartItem
export const deleteCartItem = async (id) => {
    await api.delete(`/api/v1/cart-items/${id}`);
};
