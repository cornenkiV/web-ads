package com.webads.web_ads_backend.dto;

import com.webads.web_ads_backend.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class AdSellerDTO {
    private Long id;
    private String username;
    private String phoneNumber;
    private LocalDate registrationDate;

    public AdSellerDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.phoneNumber = user.getPhoneNumber();
        this.registrationDate = user.getRegistrationDate();
    }
}
