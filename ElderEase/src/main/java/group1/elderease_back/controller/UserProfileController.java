package group1.elderease_back.controller;

import group1.elderease_back.DTO.UserProfileRequest;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping; // Required import
import org.springframework.web.bind.annotation.RequestBody; // Required import
import org.springframework.http.HttpStatus; // Required import


@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class UserProfileController {

    private final UserRepository userRepository;

    public UserProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Handles fetching the user profile. (GET /api/profile)
     * @param session HTTP session to get user ID.
     * @return Response entity with profile data or unauthorized status.
     */
    @GetMapping("")
    public ResponseEntity<UserProfileRequest> getProfile(HttpSession session) {

        // Check if user is logged in
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Fetch user from repository or throw if not found
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Map entity to DTO
        UserProfileRequest userProfileRequest = new UserProfileRequest();
        userProfileRequest.setUserId(user.getUserId());
        userProfileRequest.setFirstName(user.getFirstName());
        userProfileRequest.setLastName(user.getLastName());
        userProfileRequest.setEmail(user.getEmail());
        userProfileRequest.setRole(user.getRole());
        userProfileRequest.setAge(user.getAge());
        userProfileRequest.setPhone(user.getPhone());
        userProfileRequest.setStreet(user.getStreet());
        userProfileRequest.setCity(user.getCity());
        userProfileRequest.setState(user.getState());
        userProfileRequest.setZipcode(user.getZipcode());

        // Return profile data with 200 OK
        return ResponseEntity.ok(userProfileRequest);
    }


    /**
     * Handles updating the user profile. (PUT /api/profile)
     * @param updatedData DTO containing updated profile information from request body.
     * @param session HTTP session to get user ID.
     * @return Response entity with updated profile data or error status.
     */
    @PutMapping("") // Map PUT requests to /api/profile
    public ResponseEntity<?> updateProfile(
            @RequestBody UserProfileRequest updatedData, // Get updated data from request body
            HttpSession session) {

        // Check if user is logged in via session
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        try {
            // Fetch the existing user entity from the database
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            // Update user entity fields with data from the DTO
            user.setPhone(updatedData.getPhone());
            user.setStreet(updatedData.getStreet());
            user.setCity(updatedData.getCity());
            user.setState(updatedData.getState());
            user.setZipcode(updatedData.getZipcode());
            user.setAge(updatedData.getAge());

            // Save the updated entity back to the database
            User savedUser = userRepository.save(user);


             UserProfileRequest responseProfile = new UserProfileRequest();
             responseProfile.setUserId(savedUser.getUserId());
             responseProfile.setFirstName(savedUser.getFirstName());
             responseProfile.setLastName(savedUser.getLastName());
             responseProfile.setEmail(savedUser.getEmail());
             responseProfile.setRole(savedUser.getRole());
             responseProfile.setAge(savedUser.getAge());
             responseProfile.setPhone(savedUser.getPhone());
             responseProfile.setStreet(savedUser.getStreet());
             responseProfile.setCity(savedUser.getCity());
             responseProfile.setState(savedUser.getState());
             responseProfile.setZipcode(savedUser.getZipcode());


             return ResponseEntity.ok(responseProfile);

        } catch (RuntimeException e) {

             System.err.println("Error updating profile for user ID " + userId + ": " + e.getMessage());

             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile: " + e.getMessage());
        }
    }
}