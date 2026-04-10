package group1.elderease_back.services;

import group1.elderease_back.entities.Review;
import group1.elderease_back.entities.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewsService {

    private final ReviewRepository reviewRepository;

    public ReviewsService(ReviewRepository reviewRepository){
        this.reviewRepository= reviewRepository;
    }

    public Review saveReview(Review review){
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByPlaceId(String placeId){
        return reviewRepository.findByPlaceId(placeId);
    }
}