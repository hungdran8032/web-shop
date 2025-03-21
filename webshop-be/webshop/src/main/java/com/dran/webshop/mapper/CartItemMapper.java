package com.dran.webshop.mapper;

import com.dran.webshop.model.CartItem;
import com.dran.webshop.response.CartItemResponse;
import org.springframework.stereotype.Service;

@Service
public class CartItemMapper {
    public CartItemResponse toCartItemResponse(CartItem cartItem) {
        return CartItemResponse.builder()
                .id(cartItem.getId())
                .userId(cartItem.getUser().getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getPrice())
                .image(cartItem.getProduct().getImageUrl())
                .stock(cartItem.getProduct().getQuantity())
                .build();
    }
}