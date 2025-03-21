package group1.elderease_back.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "savedLocations",

        uniqueConstraints = { @UniqueConstraint(columnNames = {"userId", "resourceId"}) } // makes sure user cant save favorite same resource twice
)
public class SavedLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "savedLocation")
    private int savedLocation;

    @ManyToOne(optional = false) // user can save multiple location
    @JoinColumn(name = "userId", nullable = false) // Creates FK
    private User user; // The user who saved the resource.

    @ManyToOne(optional = false) // Many saved locations can point to one resource.
    @JoinColumn(name = "resourceId", nullable = false) // Creates FK.
    private Resource resource; // The resource that was saved.

    // constructor required by JPA.
    public SavedLocation() {}

    // creates SavedLocation with required feilds
    public SavedLocation(User user, Resource resource) {
        this.user = user;
        this.resource = resource;
    }

    // getter and setters

    public int getSavedLocation() {
        return savedLocation;
    }

    public void setSavedLocation(int savedLocation) {
        this.savedLocation = savedLocation;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }
}
