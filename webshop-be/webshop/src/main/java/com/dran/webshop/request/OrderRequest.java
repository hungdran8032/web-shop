package com.dran.webshop.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private String shippingAddress;
    private String phoneNumber;

    private List<OrderDetailRequest> orderDetails;
}
