package com.love2code.library_app_service.service;

import com.love2code.library_app_service.dao.BookRepository;
import com.love2code.library_app_service.dao.CheckoutRepository;
import com.love2code.library_app_service.entity.Book;
import com.love2code.library_app_service.entity.Checkout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {
    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;

    // Constructor dependency injection
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> bookTemp = bookRepository.findById(bookId);
        if (!bookTemp.isPresent()) {
            throw new Exception("Book doesn't exist");
        }

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        Book book = bookTemp.get();

        if (validateCheckout != null || book.getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checked out by user");
        }

        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.getId()
        );

        checkoutRepository.save(checkout);

        return book;
    }

    ;

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout != null) {
            return true;
        }
        return false;
    }

    public int currentLoansCount(String userEmail) {
        List<Checkout> checkoutBookList = checkoutRepository.findBooksByUserEmail(userEmail);
        return checkoutBookList.size();
    }
}
