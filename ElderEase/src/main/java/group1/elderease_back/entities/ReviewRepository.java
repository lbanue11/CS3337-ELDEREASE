package group1.elderease_back.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPlaceId(String placeId);

}