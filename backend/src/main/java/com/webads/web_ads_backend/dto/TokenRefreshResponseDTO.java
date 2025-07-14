package com.webads.web_ads_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRefreshResponseDTO {
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";

    public TokenRefreshResponseDTO(String accessToken, String refreshToken) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
    }
}