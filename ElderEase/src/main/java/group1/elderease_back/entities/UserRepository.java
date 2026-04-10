package group1.elderease_back.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    // This provides built in C.R.U.D. functionality, along with creating custom queries
    // build test for custom queries (I think...)
    Optional<User> findByEmail(String email);

    // returns everyone *except* the root admin
    List<User> findAllByUserIdNot(Integer rootAdminId);

}
