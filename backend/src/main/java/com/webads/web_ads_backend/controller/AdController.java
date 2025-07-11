package com.webads.web_ads_backend.controller;

import com.webads.web_ads_backend.dto.AdDTO;
import com.webads.web_ads_backend.dto.CreateAdDTO;
import com.webads.web_ads_backend.model.Ad;
import com.webads.web_ads_backend.service.AdService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ads")
public class AdController {

    @Autowired
    private AdService adService;

    @PostMapping
    public ResponseEntity<AdDTO> createAd(@Valid @RequestBody CreateAdDTO createAdDTO, Authentication authentication) {
        String username = authentication.getName();

        Ad newAd = adService.createAd(createAdDTO, username);
        AdDTO adDTO = new AdDTO(newAd);

        return new ResponseEntity<>(adDTO, HttpStatus.CREATED);
    }
}
