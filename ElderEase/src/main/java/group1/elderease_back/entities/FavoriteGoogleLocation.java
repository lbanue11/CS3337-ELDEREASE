package group1.elderease_back.entities;

import jakarta.persistence.*;

@Entity
@Table(
        name = "favorite_google_locations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_place",
                        columnNames = { "user_id", "place_id" }
                )
        }
)

public class FavoriteGoogleLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long favoriteId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // fields from the Google Place
    @Column(name = "place_id", nullable = false, length = 255)
    private String placeId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "googleMapsLink", nullable = false)
    private String googleMapsLink;

    public FavoriteGoogleLocation(){}

    public FavoriteGoogleLocation(User user, String placeId, String name, String address, String phone, String website, String googleMapsLink) {
        this.user = user;
        this.placeId = placeId;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.website = website;
        this.googleMapsLink = googleMapsLink;
    }

    public Long getFavoriteId() {
        return favoriteId;
    }

    public void setFavoriteId(Long favoriteId) {
        this.favoriteId = favoriteId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getGoogleMapsLink() {
        return googleMapsLink;
    }

    public void setGoogleMapsLink(String googleMapsLink) {
        this.googleMapsLink = googleMapsLink;
    }
}
