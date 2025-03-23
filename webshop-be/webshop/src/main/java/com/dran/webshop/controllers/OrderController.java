package com.dran.webshop.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.dran.webshop.request.OrderRequest;
import com.dran.webshop.response.OrderResponse;
import com.dran.webshop.service.OrderService;
import com.dran.webshop.util.JsonUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderResponse> createOrder(@RequestPart("order") String json,
            @RequestHeader("Authorization") String jwt) {

        OrderRequest req = JsonUtils.parseJson(json, OrderRequest.class);
        OrderResponse res = orderService.createOrder(req, jwt);
        return ResponseEntity.ok(res);
    }

}
