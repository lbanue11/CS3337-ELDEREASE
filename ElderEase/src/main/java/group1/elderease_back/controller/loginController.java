package group1.elderease_back.controller;

import group1.elderease_back.DTO.LoginRequest;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import group1.elderease_back.services.UserLoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true") // Allow frontend to call API
public class loginController {

    private final UserLoginService loginService;
    private final UserRepository userRepository;

    public loginController(UserLoginService loginService, UserRepository userRepository) {
        this.loginService = loginService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request, HttpSession session) {
        boolean isAuthenticated = loginService.validateUser(request);
        if (!isAuthenticated) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        // creates the user in order to get their userID
        User user = userRepository
                .findByEmail(request.getEmail()).orElseThrow();

        // store the userId their
        session.setAttribute("userId", user.getUserId());

        return ResponseEntity.ok("Login successful!");
    }

    // SHOULD ADD LOGOUT FUNCTIONALITY LATER
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }


}
