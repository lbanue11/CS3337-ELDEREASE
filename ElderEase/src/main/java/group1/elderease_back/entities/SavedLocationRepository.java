package group1.elderease_back.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedLocationRepository extends JpaRepository<SavedLocation, Integer> {

    // This provides built in C.R.U.D. functionality, along with creating custom queries
    // build test for cutom queries (I think...)

}
