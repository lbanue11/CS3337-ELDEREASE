package group1.elderease_back.services;

import group1.elderease_back.DTO.RegistrationRequest;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserRegistrationService {

    private final UserRepository userRepository;

    public UserRegistrationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void registerUser(RegistrationRequest registrationRequest) {

        // Uses checks database to see if email is already in use
        // if it is stopps whole method here and throws runtime exception with message
        if (userRepository.findByEmail(registrationRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        // MORE RESCRICTIONS CAN BE ADDED HERE ON EMAILS NAMES PASSWORD ETC
        // WE JUST HAVE TO DEVOLP THE CODE FOR IT

        // If all rescritions pass, new User is created and added to the database
        User newUser = new User();

        // user feilds are updated to equal the same as the request
        newUser.setFirstName(registrationRequest.getFirstName());
        newUser.setLastName(registrationRequest.getLastName());
        newUser.setEmail(registrationRequest.getEmail());
        newUser.setPassword(registrationRequest.getPassword());
        newUser.setRole(registrationRequest.getRole());

        // adds new user to the database server
        userRepository.save(newUser);

    }
}
