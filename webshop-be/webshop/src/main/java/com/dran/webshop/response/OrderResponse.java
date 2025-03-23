package com.dran.webshop.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private String shippingAddress;
    private String phoneNumber;
    private Double totalPrice;
    private String typeOrderStatus;
    private List<OrderDetailResponse> orderDetails;
}
