package com.webads.web_ads_backend.service;

import com.webads.web_ads_backend.dto.CreateAdDTO;
import com.webads.web_ads_backend.exceptions.ResourceNotFoundException;
import com.webads.web_ads_backend.model.Ad;
import com.webads.web_ads_backend.model.Category;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.repository.AdRepository;
import com.webads.web_ads_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdServiceTest {

    @Mock
    private AdRepository adRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdService adService;

    private User testUser;
    private Ad testAd;
    private CreateAdDTO createAdDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testAd = new Ad();
        testAd.setId(1L);
        testAd.setName("Test Ad");
        testAd.setUser(testUser);

        createAdDTO = new CreateAdDTO();
        createAdDTO.setName("New Test Ad");
        createAdDTO.setCategory("TOOLS");
        createAdDTO.setPrice(100.00);
        createAdDTO.setCity("Novi Sad");
        createAdDTO.setImageUrl("imageurl");
        createAdDTO.setDescription("description");
    }


    @Test
    void createAd_whenUserExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(adRepository.save(any(Ad.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Ad createdAd = adService.createAd(createAdDTO, "testuser");

        assertNotNull(createdAd);
        assertEquals("New Test Ad", createdAd.getName());
        assertEquals(testUser, createdAd.getUser());
        verify(adRepository, times(1)).save(any(Ad.class));
    }

    @Test
    void createAd_whenUserDoesNotExist() {
        when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            adService.createAd(createAdDTO, "unknownuser");
        });

        verify(adRepository, never()).save(any(Ad.class));
    }

    @Test
    void createAd_whenCategoryIsInvalid() {
        createAdDTO.setCategory("INVALID_CATEGORY");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        assertThrows(IllegalArgumentException.class, () -> {
            adService.createAd(createAdDTO, "testuser");
        });
    }


    @Test
    void deleteAd_whenUserIsOwner() {
        when(adRepository.findById(1L)).thenReturn(Optional.of(testAd));

        adService.deleteAd(1L, "testuser");

        verify(adRepository, times(1)).delete(testAd);
    }

    @Test
    void deleteAd_whenUserIsNotOwner() {
        when(adRepository.findById(1L)).thenReturn(Optional.of(testAd));

        assertThrows(AccessDeniedException.class, () -> {
            adService.deleteAd(1L, "anotheruser");
        });

        verify(adRepository, never()).delete(any(Ad.class));
    }

    @Test
    void deleteAd_whenAdNotFound() {
        when(adRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            adService.deleteAd(2L, "testuser");
        });
    }


    @Test
    void updateAd_whenUserIsOwner_shouldUpdateAndReturnAd() {
        when(adRepository.findById(1L)).thenReturn(Optional.of(testAd));
        when(adRepository.save(any(Ad.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateAdDTO updateDto = new CreateAdDTO();
        updateDto.setName("Updated Ad Name");
        updateDto.setCategory("SPORTS");

        Ad updatedAd = adService.updateAd(1L, updateDto, "testuser");

        assertNotNull(updatedAd);
        assertEquals("Updated Ad Name", updatedAd.getName());
        assertEquals(Category.SPORTS, updatedAd.getCategory());
        verify(adRepository, times(1)).save(testAd);
    }

    @Test
    void updateAd_whenUserIsNotOwner() {
        when(adRepository.findById(1L)).thenReturn(Optional.of(testAd));

        assertThrows(AccessDeniedException.class, () -> {
            adService.updateAd(1L, createAdDTO, "anotheruser");
        });
        verify(adRepository, never()).save(any(Ad.class));
    }

    @Test
    void getAllAds_whenCalled() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Ad> expectedPage = new PageImpl<>(Collections.emptyList());

        when(adRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(expectedPage);

        Page<Ad> resultPage = adService.getAllAds( "TOOLS", "hammer", 10.0, 50.0, 1L, pageable);

        assertNotNull(resultPage);
        assertEquals(expectedPage, resultPage);

        verify(adRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void getAllAds_withNullFilters() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Ad> expectedPage = new PageImpl<>(List.of(new Ad(), new Ad()));
        when(adRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(expectedPage);

        Page<Ad> resultPage = adService.getAllAds(null, null, null, null, null, pageable);

        assertNotNull(resultPage);
        assertEquals(2, resultPage.getTotalElements());
        verify(adRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }
}