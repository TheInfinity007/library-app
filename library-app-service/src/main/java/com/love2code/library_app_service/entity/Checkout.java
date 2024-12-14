package com.love2code.library_app_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "checkout")
public class Checkout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long Id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "checkout_date")
    private String checkoutDate;

    @Column(name = "return_date")
    private String returnDate;

    @Column(name = "book_id")
    private Long bookId;

    public Checkout() {
    }

    public Checkout(String userEmail, String returnDate, Long bookId) {
        this.userEmail = userEmail;
        this.returnDate = returnDate;
        this.bookId = bookId;
    }
}
