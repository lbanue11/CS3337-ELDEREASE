// src/main/java/group1/elderease_back/controller/CaregiverMessageController.java
package group1.elderease_back.controller;

import group1.elderease_back.DTO.InboxMessageDTO;
import group1.elderease_back.DTO.SendMessageRequest;
import group1.elderease_back.entities.Message;
import group1.elderease_back.entities.User;
import group1.elderease_back.services.MessageService;
import group1.elderease_back.entities.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class CaregiverMessageController {

    private final MessageService messageService;
    private final UserRepository userRepo;

    public CaregiverMessageController(
            MessageService messageService,
            UserRepository userRepo
    ) {
        this.messageService = messageService;
        this.userRepo       = userRepo;
    }

    private User checkRole(HttpSession session, String role) {
        Integer id = (Integer) session.getAttribute("userId");
        if (id == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User u = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (!role.equals(u.getRole())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return u;
    }

    @PostMapping("/caregiver/messages")
    public ResponseEntity<Message> sendMessage(
            @RequestBody @Valid SendMessageRequest req,
            HttpSession session
    ) {
        User sender = checkRole(session, "CAREGIVER");
        Message sent = messageService.sendMessage(
                sender.getUserId(),
                req.getElderId(),
                req.getMessage()
        );
        return ResponseEntity.ok(sent);
    }

    @GetMapping("/caregiver/messages/{elderId}")
    public ResponseEntity<List<Message>> getMessagesForElder(
            @PathVariable int elderId,
            HttpSession session
    ) {
        checkRole(session, "CAREGIVER");
        List<Message> msgs = messageService.getMessagesForElder(elderId);
        return ResponseEntity.ok(msgs);
    }

    @GetMapping("/elder/inbox")
    public ResponseEntity<List<InboxMessageDTO>> getElderInbox(HttpSession session) {
        User elder = checkRole(session, "USER");
        List<InboxMessageDTO> inbox = messageService.getElderInbox(elder.getUserId());
        return ResponseEntity.ok(inbox);
    }

    @DeleteMapping("/user/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId,
            HttpSession session
    ) {
        User user = checkRole(session, "USER");
        messageService.deleteMessageForUser(user.getUserId(), messageId);
        return ResponseEntity.noContent().build();
    }

}
