package group1.elderease_back.DTO;

public class ReviewsRequest {

    private String authorsName;
    private String date;
    private int rating;
    private String comment;

    public ReviewsRequest(){}

    public ReviewsRequest(String authorsName, String date, int rating, String comment) {
        this.authorsName = authorsName;
        this.date = date;
        this.rating = rating;
        this.comment = comment;
    }


    public String getAuthorsName() { return authorsName; }
    public void setAuthorsName(String authorsName){ this.authorsName = authorsName; }

    public String getDate() { return date; }
    public void setDate(String date){ this.date = date; }

    public int getRating() { return rating; }
    public void setRating(int rating){ this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment){ this.comment = comment; }

}