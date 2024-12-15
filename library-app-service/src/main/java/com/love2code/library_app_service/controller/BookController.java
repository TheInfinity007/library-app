package com.love2code.library_app_service.controller;

import com.love2code.library_app_service.entity.Book;
import com.love2code.library_app_service.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {
    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId) throws Exception {
        String userEmail = "testuser@yopmail.com";
        return bookService.checkoutBook(userEmail, bookId);
    }
    
    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser(@RequestParam Long bookId) {
        String userEmail = "testuser@yopmail.com";
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount() {
        String userEmail = "testuser@yopmail.com";
        return bookService.currentLoansCount(userEmail);
    }
}
