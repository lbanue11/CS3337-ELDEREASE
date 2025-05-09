package group1.elderease_back.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaregiverElderRepository extends JpaRepository<CaregiverElder, Long> {

    List<CaregiverElder> findByCaregiver(User caregiver);

}
