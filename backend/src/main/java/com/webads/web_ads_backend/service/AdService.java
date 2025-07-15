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

    private final AdRepository adRepository;

    private final UserRepository userRepository;

    @Autowired
    public AdService(AdRepository adRepository, UserRepository userRepository){
        this.adRepository = adRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new ad
     *
     * @param createAdDTO DTO containing the new ads data
     * @param username username of the user creating the ad
     * @return {@link Ad} object.
     * @throws ResourceNotFoundException if the user with that username is not found
     * @throws IllegalArgumentException if the provided category is invalid
     */
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

    /**
     * Retrieves a paginated and filtered list of ads
     *
     * @param category category to filter by
     * @param name ad name to filter by
     * @param minPrice minimum price to filter by
     * @param maxPrice maximum price to filter by
     * @param userId ID of the user to filter by
     * @param pageable pagination and sorting information.
     * @return A {@link Page} of {@link Ad} objects matching the criteria
     */
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

    /**
     * Finds ad with id
     *
     * @param id ID of the ad to find
     * @return {@link Ad} object.
     * @throws ResourceNotFoundException if no ad with the given ID
     */
    public Ad getAd(Long id) {
        return adRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ad with id " + id + " not found."));
    }

    /**
     * Updates an existing ad
     *
     * @param id ID of the ad
     * @param updateDTO DTO containing the new data for the ad
     * @param username username of the user performing the update
     * @return {@link Ad} object.
     * @throws ResourceNotFoundException if the ad with the given ID is not found
     * @throws AccessDeniedException if the user is not the owner of the ad
     * @throws IllegalArgumentException if the provided category is invalid
     */
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

    /**
     * Deletes an ad by ID
     *
     * @param id ID of the ad
     * @param username username of the user
     * @throws ResourceNotFoundException if the ad with the given ID is not found
     * @throws AccessDeniedException if the user is not the owner of the ad
     */
    public void deleteAd(Long id, String username) {
        Ad adToDelete = getAd(id);

        if (!adToDelete.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("You do not have permission to delete this ad.");
        }

        adRepository.delete(adToDelete);
    }
}