package com.dran.webshop.model;

import java.sql.Timestamp;

import com.dran.webshop.util.PaymentMethod;
import com.dran.webshop.util.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "payment")
public class Payment extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double amount;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private String transactionId;

    @Column(name = "payment_date")
    private Timestamp paymentDate;

    @Column(name = "error_message")
    private String errorMessage;
}
