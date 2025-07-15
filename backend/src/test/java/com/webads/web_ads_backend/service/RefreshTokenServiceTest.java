package com.webads.web_ads_backend.service;

import com.webads.web_ads_backend.exceptions.TokenRefreshException;
import com.webads.web_ads_backend.model.RefreshToken;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.repository.RefreshTokenRepository;
import com.webads.web_ads_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User testUser;
    private RefreshToken testRefreshToken;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenDuration", 600000L);

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testRefreshToken = new RefreshToken();
        testRefreshToken.setId(1L);
        testRefreshToken.setUser(testUser);
        testRefreshToken.setToken(UUID.randomUUID().toString());
    }

    @Test
    void createRefreshToken_shouldCreateAndSaveNewToken() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> {
            RefreshToken tokenToSave = invocation.getArgument(0);
            tokenToSave.setId(1L);
            return tokenToSave;
        });

        RefreshToken createdToken = refreshTokenService.createRefreshToken("testuser");

        assertNotNull(createdToken);
        assertNotNull(createdToken.getToken());
        assertEquals(testUser, createdToken.getUser());
        assertTrue(createdToken.getExpiryDate().isAfter(Instant.now()));
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    void verifyExpiration_whenTokenIsValid() {
        testRefreshToken.setExpiryDate(Instant.now().plusSeconds(60));

        RefreshToken verifiedToken = refreshTokenService.verifyExpiration(testRefreshToken);

        assertNotNull(verifiedToken);
        assertEquals(testRefreshToken, verifiedToken);

        verify(refreshTokenRepository, never()).delete(any(RefreshToken.class));
    }

    @Test
    void verifyExpiration_whenTokenIsExpired() {
        testRefreshToken.setExpiryDate(Instant.now().minusSeconds(60));

        assertThrows(TokenRefreshException.class, () -> {
            refreshTokenService.verifyExpiration(testRefreshToken);
        });

        verify(refreshTokenRepository, times(1)).delete(testRefreshToken);
    }

    @Test
    void findByToken_whenTokenExists() {
        String tokenString = testRefreshToken.getToken();
        when(refreshTokenRepository.findByToken(tokenString)).thenReturn(Optional.of(testRefreshToken));

        Optional<RefreshToken> foundToken = refreshTokenService.findByToken(tokenString);

        assertTrue(foundToken.isPresent());
        assertEquals(testRefreshToken, foundToken.get());
    }

    @Test
    void findByToken_whenTokenDoesNotExist() {
        when(refreshTokenRepository.findByToken("unknown")).thenReturn(Optional.empty());

        Optional<RefreshToken> foundTokenOpt = refreshTokenService.findByToken("unknown");

        assertFalse(foundTokenOpt.isPresent());
    }

    @Test
    void deleteByUserId_shouldCallRepositoryDeleteByUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        refreshTokenService.deleteByUserId(1L);

        verify(userRepository, times(1)).findById(1L);
        verify(refreshTokenRepository, times(1)).deleteByUser(testUser);
    }
}