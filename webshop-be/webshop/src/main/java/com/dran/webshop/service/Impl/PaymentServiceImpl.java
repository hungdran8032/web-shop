package com.dran.webshop.service.Impl;

import com.dran.webshop.config.VNPayConfig;
import com.dran.webshop.model.Order;
import com.dran.webshop.model.Payment;
import com.dran.webshop.repository.OrderRepository;
import com.dran.webshop.repository.PaymentRepository;
import com.dran.webshop.service.PaymentService;
import com.dran.webshop.util.TypeStatus;
import com.dran.webshop.util.PaymentMethod;
import com.dran.webshop.util.PaymentStatus;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final OrderRepository orderRepository;

    private final PaymentRepository paymentRepository;

    @Override
    public String createVNPayPaymentUrl(Order order, String clientIp) throws Exception {
        // Tạo Payment entity
        Payment payment = Payment.builder()
                .order(order)
                .user(order.getUser())
                .amount(order.getTotalPrice() * 100) // VNPay yêu cầu nhân 100
                .status(PaymentStatus.PENDING)
                .paymentMethod(PaymentMethod.VNPAY)
                .build();
        paymentRepository.save(payment);

        // Tạo URL thanh toán
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", VNPayConfig.VNP_VERSION);
        vnpParams.put("vnp_Command", VNPayConfig.VNP_COMMAND);
        vnpParams.put("vnp_TmnCode", VNPayConfig.VNP_TMN_CODE);
        vnpParams.put("vnp_Amount", String.valueOf((long) (order.getTotalPrice() * 100)));
        vnpParams.put("vnp_CurrCode", VNPayConfig.VNP_CURR_CODE);
        vnpParams.put("vnp_TxnRef", order.getId().toString()); // Mã đơn hàng làm tham chiếu
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang #" + order.getId());
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", VNPayConfig.VNP_RETURN_URL);
        vnpParams.put("vnp_IpAddr", clientIp);

        // Thời gian tạo giao dịch
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(new Date());
        vnpParams.put("vnp_CreateDate", vnp_CreateDate);

        // Tạo chuỗi dữ liệu để ký
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()))
                    .append("=")
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()))
                    .append("&");
        }
        String queryUrl = query.substring(0, query.length() - 1);

        // Tạo chữ ký bảo mật
        String vnp_SecureHash = HmacUtils.hmacSha512Hex(VNPayConfig.VNP_HASH_SECRET, queryUrl);
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        // Trả về URL thanh toán
        return VNPayConfig.VNP_PAY_URL + "?" + queryUrl;
    }

    @Override
    public void handleVNPayReturn(Map<String, String> params) {
        String vnp_TxnRef = params.get("vnp_TxnRef"); // Mã đơn hàng
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String vnp_TransactionNo = params.get("vnp_TransactionNo");
        String vnp_SecureHash = params.get("vnp_SecureHash");

        // Xác minh chữ ký
        StringBuilder signData = new StringBuilder();
        TreeMap<String, String> sortedParams = new TreeMap<>(params);
        sortedParams.remove("vnp_SecureHash");
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            signData.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        String data = signData.substring(0, signData.length() - 1);
        String checkHash = HmacUtils.hmacSha512Hex(VNPayConfig.VNP_HASH_SECRET, data);

        if (!checkHash.equals(vnp_SecureHash)) {
            throw new RuntimeException("Invalid signature");
        }

        // Tìm payment và cập nhật trạng thái
        Order order = orderRepository.findById(Long.valueOf(vnp_TxnRef))
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Payment payment = paymentRepository.findByOrder(order);

        if ("00".equals(vnp_ResponseCode)) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId(vnp_TransactionNo);
            // Cập nhật trạng thái đơn hàng nếu cần
            order.setTypeOrderStatus(TypeStatus.DELIVERING); // Giả định có trạng thái PAID
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }
        paymentRepository.save(payment);
        orderRepository.save(order);
    }

}
