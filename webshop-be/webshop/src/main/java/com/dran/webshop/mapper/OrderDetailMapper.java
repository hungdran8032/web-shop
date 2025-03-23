package com.dran.webshop.mapper;

import org.springframework.stereotype.Service;

import com.dran.webshop.model.CartItem;
import com.dran.webshop.model.Order;
import com.dran.webshop.model.OrderDetail;
import com.dran.webshop.model.Product;
// import com.dran.webshop.request.OrderDetailRequest;
import com.dran.webshop.response.OrderDetailResponse;

@Service
public class OrderDetailMapper {
    public OrderDetail convertToEntity(Order order, CartItem req, Product product) {
        return OrderDetail.builder()
                .order(order)
                .product(product)
                .quantity(req.getQuantity())
                .price(product.getPrice() * req.getQuantity())
                .build();
    }

    public OrderDetailResponse convertToResponse(OrderDetail orderDetail) {
        return OrderDetailResponse.builder()
                .productId(orderDetail.getProduct().getId())
                .quantity(orderDetail.getQuantity())
                .price(orderDetail.getPrice())
                .build();
    }
}
