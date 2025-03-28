package group1.elderease_back.controller;

import group1.elderease_back.DTO.LoginRequest;
import group1.elderease_back.entities.User;
import group1.elderease_back.services.UserLoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${frontend.url}") // Allow frontend to call API
public class loginController
{

    private UserLoginService loginService;

    public loginController(UserLoginService loginService)
    {
        this.loginService = loginService;
    }
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        boolean isAuthenticated = loginService.validateUser(request);

        if (isAuthenticated)
        {
            return "Login successful!";
        } else {
            return "Invalid credentials";
        }
    }
}
