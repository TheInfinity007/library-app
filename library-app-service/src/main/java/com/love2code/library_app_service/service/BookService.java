package com.love2code.library_app_service.service;

import com.love2code.library_app_service.dao.BookRepository;
import com.love2code.library_app_service.dao.CheckoutRepository;
import com.love2code.library_app_service.dao.HistoryRepository;
import com.love2code.library_app_service.dao.PaymentRepository;
import com.love2code.library_app_service.entity.Book;
import com.love2code.library_app_service.entity.Checkout;
import com.love2code.library_app_service.entity.History;
import com.love2code.library_app_service.entity.Payment;
import com.love2code.library_app_service.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
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
    private final HistoryRepository historyRepository;
    private final PaymentRepository paymentRepository;


    // Constructor dependency injection
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
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

        // Check for any book dues for return before checking out a new book
        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        boolean hasBookDue = false;
        Date currentDate = sdf.parse(LocalDate.now().toString());

        for (Checkout checkout : currentBooksCheckedOut) {
            Date checkoutDate = sdf.parse(checkout.getReturnDate());

            TimeUnit time = TimeUnit.DAYS;
            double differenceInTime = time.convert(checkoutDate.getTime() - currentDate.getTime(), TimeUnit.MILLISECONDS);
            if (differenceInTime < 0) {
                hasBookDue = true;
                break;
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);
        if ((userPayment != null && userPayment.getAmount() > 0) || hasBookDue) {
            throw new Exception("Outstanding fees");
        }


        // Start the checkout
        Payment payment = new Payment(userEmail);
        paymentRepository.save(payment);

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

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date currentDate = sdf.parse(LocalDate.now().toString());
        Date returnDate = sdf.parse(checkout.getReturnDate());

        TimeUnit time = TimeUnit.DAYS;

        double differenceInTime = time.convert(returnDate.getTime() - currentDate.getTime(), TimeUnit.MILLISECONDS);
        if (differenceInTime < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);

            payment.setAmount(payment.getAmount() + (differenceInTime * -1));
            paymentRepository.save(payment);
        }

        // Remove checkout
        checkoutRepository.deleteById(checkout.getId());

        // save history
        History history = new History(userEmail, checkout.getCheckoutDate(), LocalDate.now().toString(),
                book.getTitle(), book.getAuthor(), book.getDescription(), book.getImg());
        historyRepository.save(history);
    }

    public void renewBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> bookOpt = bookRepository.findById(bookId);

        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!bookOpt.isPresent() || checkout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date returnDate = sdf.parse(checkout.getReturnDate());
        Date currentDate = sdf.parse(LocalDate.now().toString());

        if (returnDate.compareTo(currentDate) >= 0) { // return date is greater  than today date
            checkout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(checkout);
        }

    }
}
