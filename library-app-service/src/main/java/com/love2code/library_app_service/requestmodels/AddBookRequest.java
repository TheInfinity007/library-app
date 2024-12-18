package com.love2code.library_app_service.requestmodels;

import lombok.Data;

@Data
public class AddBookRequest {
    private String title;
    private String author;
    private String description;
    private String category;
    private String img;
    private int copies;
}
