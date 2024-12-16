package com.love2code.library_app_service.requestmodels;

import lombok.Data;

import java.util.Optional;

@Data
public class ReviewRequest {
    private double rating;
    private Long bookId;

    private Optional<String> reviewDescription;
}
