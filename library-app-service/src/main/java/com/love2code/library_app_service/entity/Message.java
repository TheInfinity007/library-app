package com.love2code.library_app_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "title")
    private String title;

    @Column(name = "question")
    private String question;

    @Column(name = "response")
    private String response;

    @Column(name = "admin_email")
    private String adminEmail;

    @Column(name = "closed")
    private Boolean closed;
}
