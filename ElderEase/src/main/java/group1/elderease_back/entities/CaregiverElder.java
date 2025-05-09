package group1.elderease_back.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "caregiver_elder")
public class CaregiverElder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    @ManyToOne(optional = false)
    @JoinColumn(name = "elder_id", nullable = false)
    private User elder;

    protected CaregiverElder() {}

    public CaregiverElder(User caregiver, User elder) {
        this.caregiver = caregiver;
        this.elder     = elder;
    }

    public Long getId() {
        return id;
    }

    public User getCaregiver() {
        return caregiver;
    }

    public void setCaregiver(User caregiver) {
        this.caregiver = caregiver;
    }

    public User getElder() {
        return elder;
    }

    public void setElder(User elder) {
        this.elder = elder;
    }
}
