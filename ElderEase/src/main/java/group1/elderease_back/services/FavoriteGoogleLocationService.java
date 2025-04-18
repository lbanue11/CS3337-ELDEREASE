package group1.elderease_back.services;

import group1.elderease_back.DTO.GoogleFavoriteRequest;
import group1.elderease_back.entities.FavoriteGoogleLocation;
import group1.elderease_back.entities.FavoriteGoogleLocationRepository;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteGoogleLocationService {

    private final FavoriteGoogleLocationRepository favoriteGoogleLocationRepository;
    private final UserRepository userRepository;

    public FavoriteGoogleLocationService(
            FavoriteGoogleLocationRepository favoriteGoogleLocationRepository,
            UserRepository userRepository
    ) {
        this.favoriteGoogleLocationRepository = favoriteGoogleLocationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FavoriteGoogleLocation addFavoriteGoogleLocation(int userId, GoogleFavoriteRequest googleFavoriteRequest) {
        // Prevent duplicate favorites
        if (favoriteGoogleLocationRepository.existsByUser_UserIdAndPlaceId(userId, googleFavoriteRequest.getPlaceId())) {
            throw new IllegalStateException("You’ve already favorited that place.");
        }

        // Load the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Map DTO to entity
        FavoriteGoogleLocation favoriteGoogleLocation = new FavoriteGoogleLocation(
                user,
                googleFavoriteRequest.getPlaceId(),
                googleFavoriteRequest.getName(),
                googleFavoriteRequest.getAddress(),
                googleFavoriteRequest.getPhone(),
                googleFavoriteRequest.getWebsite(),
                googleFavoriteRequest.getGoogleMapsLink()
        );

        // Persist and return
        return favoriteGoogleLocationRepository.save(favoriteGoogleLocation);
    }

    @Transactional(readOnly = true)
    public List<FavoriteGoogleLocation> getFavoritesByUser(int userId) {
        return favoriteGoogleLocationRepository.findByUser_UserId(userId);
    }

    @Transactional
    public void removeGoogleFavorite(int userId, long favoriteGoogleLocationId) {
        FavoriteGoogleLocation favoriteGoogleLocation = favoriteGoogleLocationRepository.findById(favoriteGoogleLocationId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found"));

        if (favoriteGoogleLocation.getUser().getUserId() != userId) {
            throw new IllegalArgumentException("Cannot delete another user’s favorite");
        }

        favoriteGoogleLocationRepository.delete(favoriteGoogleLocation);
    }
}