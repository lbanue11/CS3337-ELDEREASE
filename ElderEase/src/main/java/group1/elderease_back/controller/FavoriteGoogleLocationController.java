package group1.elderease_back.controller;


import group1.elderease_back.DTO.GoogleFavoriteRequest;
import group1.elderease_back.entities.FavoriteGoogleLocation;
import group1.elderease_back.services.FavoriteGoogleLocationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/google-favorites")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class FavoriteGoogleLocationController {

    private final FavoriteGoogleLocationService favoriteGoogleLocationService;

    public FavoriteGoogleLocationController(
            FavoriteGoogleLocationService favoriteGoogleLocationService
    ) {
        this.favoriteGoogleLocationService = favoriteGoogleLocationService;
    }

    @PostMapping  // POST → /api/google-favorites
    public ResponseEntity<?> addGoogleFavorite(
            @RequestBody GoogleFavoriteRequest googleFavoriteRequest, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in");
        }

        try {
            FavoriteGoogleLocation saved = favoriteGoogleLocationService.addFavoriteGoogleLocation(userId, googleFavoriteRequest);
            return ResponseEntity.ok(saved);
        } catch (IllegalStateException e) {
            //duplicate favorite
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<FavoriteGoogleLocation>> listFavorites(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<FavoriteGoogleLocation> favs = favoriteGoogleLocationService.getFavoritesByUser(userId);
        return ResponseEntity.ok(favs);
    }

    @DeleteMapping("/{favoriteGoogleLocationId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long favoriteGoogleLocationId,
            HttpSession session
    ) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            favoriteGoogleLocationService.removeGoogleFavorite(userId, favoriteGoogleLocationId);
            return ResponseEntity.noContent().build();         // 204
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)  // 403 if not found/owned
                    .build();
        }
    }
}