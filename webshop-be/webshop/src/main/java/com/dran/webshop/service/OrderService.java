package com.dran.webshop.service;

import java.util.List;

import com.dran.webshop.request.OrderRequest;
import com.dran.webshop.request.UpdateStatusRequest;
import com.dran.webshop.response.OrderResponse;

public interface OrderService {
    // Tạo
    OrderResponse createOrder(OrderRequest req, String jwt);

    // lấy danh sách order của người dùng
    List<OrderResponse> getOrdersByUser(Long userId);

    // lấy order theo id cho admin
    OrderResponse getOrderById(Long orderId);

    // lấy order theo id cho user
    OrderResponse getOrderByIdForUser(Long orderId, Long userId);

    OrderResponse updateOrderStatus(Long orderId, UpdateStatusRequest req);

    List<OrderResponse> getOrders();
}
