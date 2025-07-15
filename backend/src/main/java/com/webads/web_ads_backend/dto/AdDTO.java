package com.webads.web_ads_backend.dto;

import com.webads.web_ads_backend.model.Ad;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AdDTO {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Double price;
    private String category;
    private String city;
    private LocalDateTime postDate;
    private AdSellerDTO seller;

    public AdDTO(Ad ad) {
        this.id = ad.getId();
        this.name = ad.getName();
        this.description = ad.getDescription();
        this.imageUrl = ad.getImageUrl();
        this.price = ad.getPrice();
        this.category = ad.getCategory().toString();
        this.city = ad.getCity();
        this.postDate = ad.getPostDate();
        if (ad.getUser() != null) {
            this.seller = new AdSellerDTO(ad.getUser());
        }
    }
}
