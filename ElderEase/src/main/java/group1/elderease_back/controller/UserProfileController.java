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

// Retrieve and edit user data

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class UserProfileController {

    private final UserRepository userRepository;

    public UserProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("")
    public ResponseEntity<UserProfileRequest> getProfile(HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        if(userId == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

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

        return ResponseEntity.ok(userProfileRequest);

    }

    // ADD EDIT USER FUNCTIONALITY


}
