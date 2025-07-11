package com.webads.web_ads_backend.dto;

import com.webads.web_ads_backend.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String phoneNumber;
    private LocalDate registrationDate;

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.phoneNumber = user.getPhoneNumber();
        this.registrationDate = user.getRegistrationDate();
    }
}