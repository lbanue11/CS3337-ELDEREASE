package group1.elderease_back.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendMessageRequest {

    @Min(value = 1, message = "elderId must be a positive integer")
    private int elderId;

    @NotBlank(message = "message must not be empty")
    private String message;

    public int getElderId() {
        return elderId;
    }

    public void setElderId(int elderId) {
        this.elderId = elderId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
