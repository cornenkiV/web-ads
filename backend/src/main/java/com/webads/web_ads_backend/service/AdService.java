package com.webads.web_ads_backend.service;

import com.webads.web_ads_backend.dto.CreateAdDTO;
import com.webads.web_ads_backend.exceptions.ResourceNotFoundException;
import com.webads.web_ads_backend.model.Ad;
import com.webads.web_ads_backend.model.Category;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.repository.AdRepository;
import com.webads.web_ads_backend.repository.UserRepository;
import com.webads.web_ads_backend.specification.AdSpecificationBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;
import org.springframework.security.access.AccessDeniedException;

@Service
public class AdService {

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private UserRepository userRepository;

    public Ad createAd(CreateAdDTO createAdDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Ad ad = new Ad();
        ad.setName(createAdDTO.getName());
        ad.setDescription(createAdDTO.getDescription());
        ad.setImageUrl(createAdDTO.getImageUrl());
        ad.setPrice(createAdDTO.getPrice());
        ad.setCity(createAdDTO.getCity());

        try {
            ad.setCategory(Category.valueOf(createAdDTO.getCategory().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + createAdDTO.getCategory());
        }

        ad.setPostDate(LocalDateTime.now());
        ad.setUser(user);

        return adRepository.save(ad);
    }


    public Page<Ad> getAllAds(String category, String name, Double minPrice, Double maxPrice, Long userId, Pageable pageable) {
        AdSpecificationBuilder builder = new AdSpecificationBuilder();

        Specification<Ad> spec = builder
                .withCategory(category)
                .withName(name)
                .withMinPrice(minPrice)
                .withMaxPrice(maxPrice)
                .withUserId(userId)
                .build();

        return adRepository.findAll(spec, pageable);
    }

    public Ad getAd(Long id) {
        return adRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ad with id " + id + " not found."));
    }

    public Ad updateAd(Long id, CreateAdDTO updateDTO, String username) {
        Ad adToUpdate = getAd(id);

        if (!adToUpdate.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("You do not have permission to edit this ad.");
        }

        adToUpdate.setName(updateDTO.getName());
        adToUpdate.setDescription(updateDTO.getDescription());
        adToUpdate.setImageUrl(updateDTO.getImageUrl());
        adToUpdate.setPrice(updateDTO.getPrice());
        adToUpdate.setCity(updateDTO.getCity());
        try {
            adToUpdate.setCategory(Category.valueOf(updateDTO.getCategory().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + updateDTO.getCategory());
        }

        return adRepository.save(adToUpdate);
    }
}