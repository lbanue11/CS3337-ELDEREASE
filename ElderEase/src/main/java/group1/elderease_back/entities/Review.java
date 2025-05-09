package group1.elderease_back.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="google_reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String authorName;
    private LocalDate date;
    private int rating;

    @Column(length=2000)
    private String comment;

    private String placeId;

    public Review() {}
    public Review(String authorName, LocalDate date, int rating, String comment, String placeId) {
        this.authorName = authorName;
        this.date = date;
        this.rating = rating;
        this.comment = comment;
        this.placeId = placeId;

    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }
}