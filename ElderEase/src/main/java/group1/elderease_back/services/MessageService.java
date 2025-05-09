package group1.elderease_back.services;

import group1.elderease_back.DTO.InboxMessageDTO;
import group1.elderease_back.entities.Message;
import group1.elderease_back.entities.MessageRepository;
import group1.elderease_back.entities.User;
import group1.elderease_back.entities.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository repo;
    private final UserRepository  userRepo;

    public MessageService(MessageRepository repo, UserRepository userRepo) {
        this.repo     = repo;
        this.userRepo = userRepo;
    }

    public List<InboxMessageDTO> getElderInbox(int elderId) {
        User elder = userRepo.findById(elderId)
                .orElseThrow(() -> new EntityNotFoundException("Elder not found"));
        return repo.findByElder(elder).stream()
                .map(m -> new InboxMessageDTO(
                        m.getMessageId(),
                        m.getContent(),
                        m.getSentAt(),
                        m.getCaregiver().getUserId(),
                        m.getCaregiver().getFirstName(),
                        m.getCaregiver().getLastName()
                ))
                .collect(Collectors.toList());
    }

    public void deleteMessageForUser(int userId, Long messageId) {
        Message msg = repo.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));
        if (msg.getElder().getUserId() != userId) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your message");
        }
        repo.delete(msg);
    }


    public Message sendMessage(int caregiverId, int elderId, String content) {
        User caregiver = userRepo.findById(caregiverId)
                .orElseThrow(() -> new EntityNotFoundException("Caregiver not found"));
        User elder = userRepo.findById(elderId)
                .orElseThrow(() -> new EntityNotFoundException("Elder not found"));
        Message msg = new Message(caregiver, elder, content);
        return repo.save(msg);
    }

    public List<Message> getMessagesForElder(int elderId) {
        User elder = userRepo.findById(elderId)
                .orElseThrow(() -> new EntityNotFoundException("Elder not found"));
        return repo.findByElder(elder);
    }
}

