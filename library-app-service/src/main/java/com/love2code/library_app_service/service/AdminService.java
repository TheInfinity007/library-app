package com.love2code.library_app_service.service;

import com.love2code.library_app_service.dao.BookRepository;
import com.love2code.library_app_service.dao.CheckoutRepository;
import com.love2code.library_app_service.dao.ReviewRepository;
import com.love2code.library_app_service.entity.Book;
import com.love2code.library_app_service.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final CheckoutRepository checkoutRepository;

    @Autowired
    AdminService(BookRepository bookRepository, ReviewRepository reviewRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book addBook(AddBookRequest addBookRequest) {
        Book book = new Book();

        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());

        bookRepository.save(book);

        return book;
    }

    public void deleteBook(Long bookId) throws Exception {
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (!bookOpt.isPresent()) {
            throw new Exception("Book not found");
        }

        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
        bookRepository.deleteById(bookId);
    }

    public Book increaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (!bookOpt.isPresent()) {
            throw new Exception("Book not  found");
        }

        Book book = bookOpt.get();

        book.setCopiesAvailable(book.getCopiesAvailable() + 1);
        book.setCopies(book.getCopies() + 1);

        bookRepository.save(book);

        return book;
    }

    public Book decreaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (!bookOpt.isPresent()) {
            throw new Exception("Book not found");
        }

        Book book = bookOpt.get();

        if (book.getCopiesAvailable() <= 0 || book.getCopies() <= 0) {
            throw new Exception("Quantity Locked");
        }

        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        book.setCopies(book.getCopies() - 1);

        bookRepository.save(book);

        return book;
    }

}
