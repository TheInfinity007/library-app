class ReviewModel {
    id: number;
    userEmail: string;
    date: string;
    bookId: number;
    reviewDescription?: string;

    constructor(id: number, userEmail: string, date: string, bookId: number, reviewDescription: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.date = date;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewModel;