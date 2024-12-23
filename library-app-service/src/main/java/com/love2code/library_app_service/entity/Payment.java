package com.love2code.library_app_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "payment")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "amount")
    private double amount;

    public Payment() {
    }

    public Payment(String userEmail) {
        this.userEmail = userEmail;
        this.amount = 00.00;
    }
}
