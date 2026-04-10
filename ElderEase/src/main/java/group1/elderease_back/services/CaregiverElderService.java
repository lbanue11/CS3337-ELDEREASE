package group1.elderease_back.services;

import group1.elderease_back.entities.CaregiverElder;
import group1.elderease_back.entities.CaregiverElderRepository;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaregiverElderService {
    private final CaregiverElderRepository linkRepo;
    private final UserRepository           userRepo;

    public CaregiverElderService(CaregiverElderRepository linkRepo,
                                 UserRepository userRepo) {
        this.linkRepo = linkRepo;
        this.userRepo = userRepo;
    }

    // Link an elder to a caregiver
    public void addElderToCaregiver(int caregiverId, int elderId) {
        User caregiver = userRepo.findById(caregiverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));
        User elder = userRepo.findById(elderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Elder not found"));

        // check for existing link to prevent duplicates
        boolean exists = linkRepo.findByCaregiver(caregiver).stream()
                .anyMatch(link -> link.getElder().getUserId() == elderId);
        if (exists) return;

        CaregiverElder link = new CaregiverElder(caregiver, elder);
        linkRepo.save(link);
    }

    // Fetch all elders for a caregiver
    public List<User> getEldersForCaregiver(int caregiverId) {
        User caregiver = userRepo.findById(caregiverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caregiver not found"));

        return linkRepo.findByCaregiver(caregiver).stream()
                .map(CaregiverElder::getElder)
                .collect(Collectors.toList());
    }
}
