package group1.elderease_back.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FavoriteGoogleLocationRepository extends JpaRepository<FavoriteGoogleLocation, Long> {

    List<FavoriteGoogleLocation> findByUser_UserId(int userId);
    boolean existsByUser_UserIdAndPlaceId(int userId, String placeId);

    void deleteAllByUserUserId(int userId);
}
