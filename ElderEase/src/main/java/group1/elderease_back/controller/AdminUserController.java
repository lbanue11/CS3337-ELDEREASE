package group1.elderease_back.controller;

import group1.elderease_back.DTO.AdminUserCrudRequest;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserCrudRequest>> listAllUsers(HttpSession session) {
        checkAdmin(session);
        List<AdminUserCrudRequest> all = userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(all);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserCrudRequest> getOneUser(
            @PathVariable int id,
            HttpSession session
    ) {
        checkAdmin(session);
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(toDto(user)))
                // explicitly tell Java this is a ResponseEntity<AdminUserCrudRequest>
                .orElseGet(() -> ResponseEntity.<AdminUserCrudRequest>notFound().build());
    }

    // 3) UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(
            @PathVariable int id,
            @RequestBody AdminUserCrudRequest dto,
            HttpSession session
    ) {
        checkAdmin(session);

        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(dto.getFirstName());
                    user.setLastName( dto.getLastName());
                    user.setEmail(    dto.getEmail());
                    user.setRole(     dto.getRole());
                    userRepository.save(user);
                    // explicitly Void so it matches ResponseEntity<Void>
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() ->
                        // likewise explicitly Void here
                        ResponseEntity.notFound().<Void>build()
                );
    }

    // 4) DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable int id,
            HttpSession session
    ) {
        checkAdmin(session);
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    private void checkAdmin(HttpSession session) {
        Integer currentUserId = (Integer) session.getAttribute("userId");
        if (currentUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        User current = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (!"ADMIN".equals(current.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private AdminUserCrudRequest toDto(User user) {
        AdminUserCrudRequest dto = new AdminUserCrudRequest();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
