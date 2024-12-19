package com.love2code.library_app_service.controller;

import com.love2code.library_app_service.entity.Book;
import com.love2code.library_app_service.requestmodels.AddBookRequest;
import com.love2code.library_app_service.service.AdminService;
import com.love2code.library_app_service.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/secure/add/book")
    public Book addBook(@RequestHeader(name = "Authorization") String token,
                        @RequestBody AddBookRequest addBookRequest) throws Exception {
        String userType = ExtractJWT.payloadJWTExtraction(token, "userType");

        if (userType == null || !userType.equals("ADMIN")) {
            throw new Exception("You are not authorized to add book. Please contact admin.");
        }

        return adminService.addBook(addBookRequest);

    }

    @PutMapping("/secure/increase/book/quantity")
    public Book increaseBookQuantity(@RequestHeader(name = "Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        String userType = ExtractJWT.payloadJWTExtraction(token, "userType");

        if (userType == null || !userType.equals("ADMIN")) {
            throw new Exception("You are not authorized to increase book. Please contact admin.");
        }

        return adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public Book decreaseBookQuantity(@RequestHeader(name = "Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        String userType = ExtractJWT.payloadJWTExtraction(token, "userType");

        if (userType == null || !userType.equals("ADMIN")) {
            throw new Exception("You are not authorized to decrease book. Please contact admin.");
        }

        return adminService.decreaseBookQuantity(bookId);
    }
}
