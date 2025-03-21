package group1.elderease_back.controller;

import group1.elderease_back.entities.User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to call API
public class loginController {

    private final List<User> users = new ArrayList<>();

    public loginController() {
        // Hardcoded users for testing
        users.add(new User("John", "Doe", "john@example.com", "password123", "USER"));
        users.add(new User("Alice", "Smith", "alice@example.com", "mypassword", "ADMIN"));
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) {
        for (User user : users) {
            if (user.getEmail().equals(loginRequest.getEmail()) && user.getPassword().equals(loginRequest.getPassword())) {
                return "Login successful!";
            }
        }
        return "Invalid email or password!";
    }
    // Register a new user
    @PostMapping("/register")
    public String register(@RequestBody User newUser) {
        // You can add validations and other checks here
        for (User user : users) {
            if (user.getEmail().equals(newUser.getEmail())) {
                return "Email already in use!";
            }
        }
        // Add the new user to the list (in a real application, you would save it to a database)
        users.add(newUser);
        return "User registered successfully!";
    }
}
