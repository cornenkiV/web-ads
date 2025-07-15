package com.webads.web_ads_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private String username;

    public LoginResponseDTO(String accessToken, String refreshToken, String username) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
    }
}
