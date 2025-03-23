package com.dran.webshop.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dran.webshop.model.Order;
import com.dran.webshop.request.OrderRequest;
import com.dran.webshop.response.OrderResponse;
import com.dran.webshop.util.TypeStatus;

@Service
public class OrderMapper {
    @Autowired
    private OrderDetailMapper orderDetailMapper;

    public Order convertToEntity(OrderRequest req) {
        return Order.builder()
                .shippingAddress(req.getShippingAddress())
                .phoneNumber(req.getPhoneNumber())
                .typeOrderStatus(TypeStatus.PENDING)
                .build();
    }

    public OrderResponse convertToResponse(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .userId(order.getUser().getId())
                .shippingAddress(order.getShippingAddress())
                .phoneNumber(order.getPhoneNumber())
                .totalPrice(order.getTotalPrice())
                .typeOrderStatus(order.getTypeOrderStatus().name())
                .orderDetails(order.getOrderDetails().stream().map(
                        orderDetailMapper::convertToResponse)
                        .collect(Collectors.toList()))
                .build();
    }
}
