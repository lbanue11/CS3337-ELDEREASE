package group1.elderease_back.services;

import group1.elderease_back.DTO.RegistrationRequest;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class UserRegistrationService {

    private final UserRepository userRepository;

    public UserRegistrationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void registerUser(RegistrationRequest req) {

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email already in use"
            );
        }

        User newUser = new User();
        newUser.setFirstName(req.getFirstName());
        newUser.setLastName(req.getLastName());
        newUser.setEmail(req.getEmail());
        newUser.setPassword(req.getPassword());

        if ("CAREGIVER".equalsIgnoreCase(req.getRole())) {
            newUser.setRole("CAREGIVER");
        } else {
            newUser.setRole("USER");
        }

        userRepository.save(newUser);
    }
}
