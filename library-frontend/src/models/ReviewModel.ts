class ReviewModel {
    id: number;
    userEmail: string;
    date: string;
    bookId: number;
    rating: number;
    reviewDescription?: string;

    constructor(id: number, userEmail: string, date: string, bookId: number, rating: number, reviewDescription: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.date = date;
        this.bookId = bookId;
        this.rating = rating;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewModel;