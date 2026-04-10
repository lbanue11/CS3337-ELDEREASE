package group1.elderease_back.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users") //map this class to the "users" table
public class User {

    @Id // sets user_id as PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // creates SERIAL type that increments as you add users
    @Column(name = "userId")
    private int userId; // mapped to userId column in postgreSQL database

    // each variable will be mapped to a column in the postgreSQL database based on its name
    // along with certain contstraints

    @Column(name = "firstName", nullable = false, length = 50) // mapped to firstName column in postgreSQL database
    private String firstName;

    @Column(name = "lastName", nullable = false, length = 50) // mapped to lastName column in postgreSQL database
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, length = 100) // will not add email, if already exist in database
    private String email; // mapped to email column in postgreSQL database

    @Column(name = "password", nullable = false, length = 255) // mapped to password column in postgreSQL database
    private String password;

    @Column(name = "role", nullable = false, length = 20)
    private String role;


    private Integer age; // Integer if inputing age is optional, allows to be null -- let me know if you want to change or delete

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "street", length = 255)
    private String street;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "zipcode", length = 20)
    private String zipcode;

    // constructor required by JPA
    public User() {}

    // Creates a user -- requires these feilds
    public User(String firstName, String lastName, String email, String password, String role) {

        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;

    }

    //getters and setters

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
}
