package com.webads.web_ads_backend.controller;

import com.webads.web_ads_backend.dto.AdDTO;
import com.webads.web_ads_backend.dto.CreateAdDTO;
import com.webads.web_ads_backend.model.Ad;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.service.AdService;
import com.webads.web_ads_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ads")
public class AdController {

    @Autowired
    private AdService adService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<AdDTO> createAd(@Valid @RequestBody CreateAdDTO createAdDTO, Authentication authentication) {
        String username = authentication.getName();

        Ad newAd = adService.createAd(createAdDTO, username);
        AdDTO adDTO = new AdDTO(newAd);

        return new ResponseEntity<>(adDTO, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<Page<AdDTO>> getAllAds(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "false") boolean showMineOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("postDate").descending());

        Long userId = null;
        if (showMineOnly) {
            if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
                User user = (User) userService.getUserByUsername(authentication.getName());
                userId = user.getId();
            } else {
                return ResponseEntity.ok(Page.empty(pageable));
            }
        }

        Page<Ad> adPage = adService.getAllAds(category, name, minPrice, maxPrice, userId, pageable);
        Page<AdDTO> adDtoPage = adPage.map(AdDTO::new);

        return ResponseEntity.ok(adDtoPage);
    }
}
