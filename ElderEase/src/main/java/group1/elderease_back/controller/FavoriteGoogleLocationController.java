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
@CrossOrigin(
        origins = "${frontend.url}",
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
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
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .build();
        }
    }

    @DeleteMapping("/user")
    public ResponseEntity<Void> removeAllFavorites(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        favoriteGoogleLocationService.removeAllByUser(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> removeAllFavoritesFor(
            @PathVariable Integer userId,
            HttpSession session
    ) {

        Integer me = (Integer) session.getAttribute("userId");
        if (me == null /*|| !isAdmin(me)*/ ) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        favoriteGoogleLocationService.removeAllByUser(userId);
        return ResponseEntity.noContent().build();
    }


}