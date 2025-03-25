package group1.elderease_back.controller;

import group1.elderease_back.DTO.RegistrationRequest;
import group1.elderease_back.services.UserRegistrationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${frontend.url}")
public class registrationController {

    private final UserRegistrationService userRegistrationService;

    public registrationController(UserRegistrationService userRegistrationService) {
        this.userRegistrationService = userRegistrationService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegistrationRequest registrationRequest) {
        userRegistrationService.registerUser(registrationRequest);
        return "Registered successfully!";
    }
}
