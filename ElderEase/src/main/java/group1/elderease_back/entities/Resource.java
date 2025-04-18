package group1.elderease_back.entities;


import jakarta.persistence.*;

@Entity
@Table(name = "resources") // map this class to the "resources" table
public class Resource {

    @Id // sets resourceId as PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // creates SERIAL type that increments as you add resouce providers
    @Column(name = "resourceId")
    private int resourceId;

    @OneToOne // each resource has one user assigned and each user can only create one resource (can be changed to allow multiple if needed))
    @JoinColumn(name = "resourceUserId", nullable = false) // creates FK
    private User resourceUser; // Resourcer Provider User

    @Column(name = "name", nullable = false, length = 200) // Mapped to "name" column; required, max 200 characters.
    private String name;

    @Column(name = "description", columnDefinition = "TEXT") // Mapped to "description" column; stored as TEXT.
    private String description;

    @Column(name = "category", length = 100) // Mapped to "category" column; max 100 characters.
    private String category;

    @Column(name = "phone", length = 20) // Mapped to "phone" column; max 20 characters.
    private String phone;

    @Column(name = "email", length = 100) // Mapped to "email" column; max 100 characters.
    private String email;

    @Column(name = "Website", length = 255) // Mapped to "street" column; max 255 characters.
    private String Website;

    @Column(name = "street", length = 255) // Mapped to "street" column; max 255 characters.
    private String street;

    @Column(name = "city", length = 100) // Mapped to "city" column; max 100 characters.
    private String city;

    @Column(name = "state", length = 50) // Mapped to "state" column; max 50 characters.
    private String state;

    @Column(name = "zipcode", length = 20) // Mapped to "zipcode" column; max 20 characters.
    private String zipcode;

    @Column(name = "status", nullable = false, length = 20) // Mapped to "status" column; required, max 20 characters.
    private String status;

    // emopty constructor required by JPA
    public Resource() {}

    // creates Resource with required feilds
    Resource(User resourceUser, String name, String status) {

        this.resourceUser = resourceUser;
        this.name = name;
        this.status = status;

    }

    //getters and setters


    public int getResourceId() {
        return resourceId;
    }

    public void setResourceId(int resourceId) {
        this.resourceId = resourceId;
    }

    public User getResourceUser() {
        return resourceUser;
    }

    public void setResourceUser(User resourceUser) {
        this.resourceUser = resourceUser;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
