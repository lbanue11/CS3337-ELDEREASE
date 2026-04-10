package group1.elderease_back;

import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByEmail() {

        // create and saves a test user

        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setRole("Role");
        userRepository.save(user);

        //test to see if its there
        Optional<User> retrieved = userRepository.findByEmail("test@example.com");
        assertTrue(retrieved.isPresent());
        assertEquals("Test", retrieved.get().getFirstName());

    }

}