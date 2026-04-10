package group1.elderease_back.controller;

import group1.elderease_back.entities.Review;
import group1.elderease_back.services.ReviewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/google-reviews")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class ReviewController {

    private final ReviewsService reviewsService;

    public ReviewController(ReviewsService reviewsService) {
        this.reviewsService = reviewsService;
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<List<Review>> getReviewsByPlaceId(@PathVariable String placeId){
        return ResponseEntity.ok(reviewsService.getReviewsByPlaceId(placeId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review){
        return ResponseEntity.ok(reviewsService.saveReview(review));
    }
}