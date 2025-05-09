package group1.elderease_back.controller;

import group1.elderease_back.entities.UserRepository;
import group1.elderease_back.services.CaregiverElderService;
import group1.elderease_back.entities.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class CaregiverElderController {

    private final CaregiverElderService service;
    private final UserRepository userRepo;

    public CaregiverElderController(CaregiverElderService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    private User checkCaregiver(HttpSession session) {
        // Get userId from session
        Object id = session.getAttribute("userId");
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        }

        User user = userRepo.findById((int) ((Number)id).longValue())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found")
                );

        // Verify role
        if (!"CAREGIVER".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a caregiver");
        }

        return user;
    }

    // Link an elder to the logged-in caregiver
    @PostMapping("/api/caregiver/elders")
    public void addElder(
            @RequestBody Map<String, Integer> body,
            HttpSession session
    ) {
        User caregiver = checkCaregiver(session);
        int elderId = body.get("elderId");
        service.addElderToCaregiver(caregiver.getUserId(), elderId);
    }

    // List all elders linked to the logged-in caregiver
    @GetMapping("/api/caregiver/elders")
    public List<User> listElders(HttpSession session) {
        User caregiver = checkCaregiver(session);
        return service.getEldersForCaregiver(caregiver.getUserId());
    }
}
