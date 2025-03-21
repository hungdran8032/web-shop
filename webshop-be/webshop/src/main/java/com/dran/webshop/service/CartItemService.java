package com.dran.webshop.service;

import com.dran.webshop.request.CartItemRequest;
import com.dran.webshop.response.CartItemResponse;

import java.util.List;

public interface CartItemService {
    CartItemResponse createCartItem(CartItemRequest req);

    CartItemResponse updateQuantity(Long id, Integer quantity);

    List<CartItemResponse> getCartItemsByUser(Long userId);

    void deleteCartItem(Long id);
}