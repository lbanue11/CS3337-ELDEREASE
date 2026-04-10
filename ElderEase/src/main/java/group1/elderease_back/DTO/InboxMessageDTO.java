package group1.elderease_back.DTO;

import java.time.LocalDateTime;

public class InboxMessageDTO {
    private Long   messageId;
    private String content;
    private LocalDateTime sentAt;
    private int    caregiverId;
    private String caregiverFirstName;
    private String caregiverLastName;

    public InboxMessageDTO(Long messageId, String content, LocalDateTime sentAt, int caregiverId, String caregiverFirstName, String caregiverLastName
    ) {
        this.messageId = messageId;
        this.content = content;
        this.sentAt = sentAt;
        this.caregiverId = caregiverId;
        this.caregiverFirstName = caregiverFirstName;
        this.caregiverLastName = caregiverLastName;
    }

    public Long getMessageId()            { return messageId; }
    public String getContent()            { return content; }
    public LocalDateTime getSentAt()      { return sentAt; }
    public int getCaregiverId()           { return caregiverId; }
    public String getCaregiverFirstName() { return caregiverFirstName; }
    public String getCaregiverLastName()  { return caregiverLastName; }
}
