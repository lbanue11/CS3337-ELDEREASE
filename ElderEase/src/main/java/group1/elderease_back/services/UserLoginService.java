package group1.elderease_back.services;

import group1.elderease_back.DTO.LoginRequest;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserLoginService
{
    private final UserRepository userRepository;

    public UserLoginService(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public boolean validateUser(LoginRequest login)
    {
        Optional<User> checkUser = userRepository.findByEmail(login.getEmail());

        if(checkUser.isPresent())
        {
            User user = checkUser.get();
            return user.getPassword().equals(login.getPassword()) && user.getEmail().equals(login.getEmail());
        }
        return false;
    }

}
