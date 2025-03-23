package com.dran.webshop.service;

import java.util.List;

import com.dran.webshop.request.OrderRequest;
import com.dran.webshop.request.UpdateStatusRequest;
import com.dran.webshop.response.OrderResponse;

public interface OrderService {
    OrderResponse createOrder(OrderRequest req, String jwt);

    List<OrderResponse> getOrdersByUser(Long userId);

    OrderResponse getOrderById(Long orderId);

    void updateOrderStatus(Long orderId, UpdateStatusRequest req);

    List<OrderResponse> getOrders();
}
