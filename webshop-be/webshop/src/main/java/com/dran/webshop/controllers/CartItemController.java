package com.dran.webshop.controllers;

import com.dran.webshop.request.CartItemRequest;
import com.dran.webshop.response.CartItemResponse;
import com.dran.webshop.service.CartItemService;
import com.dran.webshop.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart-items")
@RequiredArgsConstructor
public class CartItemController {
    private final CartItemService cartItemService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<CartItemResponse> createCartItem(@RequestPart("cartItem") String cartItemJson) {
        CartItemRequest req = JsonUtils.parseJson(cartItemJson, CartItemRequest.class);
        CartItemResponse res = cartItemService.createCartItem(req);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/quantity")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<CartItemResponse> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        CartItemResponse res = cartItemService.updateQuantity(id, quantity);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<CartItemResponse>> getCartItemsByUser(@PathVariable Long userId) {
        List<CartItemResponse> res = cartItemService.getCartItemsByUser(userId);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        cartItemService.deleteCartItem(id);
        return ResponseEntity.ok().build();
    }
}