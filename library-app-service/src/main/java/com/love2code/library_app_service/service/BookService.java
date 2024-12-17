package com.love2code.library_app_service.service;

import com.love2code.library_app_service.dao.BookRepository;
import com.love2code.library_app_service.dao.CheckoutRepository;
import com.love2code.library_app_service.entity.Book;
import com.love2code.library_app_service.entity.Checkout;
import com.love2code.library_app_service.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

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

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        for (Checkout checkout : checkoutList) {
            bookIdList.add(checkout.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date currentDate = sdf.parse(LocalDate.now().toString());
        TimeUnit time = TimeUnit.DAYS;
        for (Book book : books) {

            Optional<Checkout> checkout = checkoutList.stream().filter(x -> x.getBookId() == book.getId()).findFirst();
            if (checkout.isPresent()) {

                // Checkout should always be present
                Date returnDate = sdf.parse(checkout.get().getReturnDate());
                long differenceInTime = time.convert(returnDate.getTime() - currentDate.getTime(), TimeUnit.MILLISECONDS);

                ShelfCurrentLoansResponse loanResponse = new ShelfCurrentLoansResponse(book, (int) differenceInTime);
                shelfCurrentLoansResponses.add(loanResponse);
            }
        }

        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!bookOpt.isPresent() || checkout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        Book book = bookOpt.get();
        book.setCopiesAvailable(book.getCopiesAvailable() + 1);

        bookRepository.save(book);
        checkoutRepository.deleteById(checkout.getId());

    }
}
