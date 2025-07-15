package com.webads.web_ads_backend.service;

import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.exceptions.TokenRefreshException;
import com.webads.web_ads_backend.model.RefreshToken;
import com.webads.web_ads_backend.repository.RefreshTokenRepository;
import com.webads.web_ads_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${jwt.refresh-expiration}")
    private Long refreshTokenDuration;

    private final RefreshTokenRepository refreshTokenRepository;

    private final UserRepository userRepository;

    @Autowired
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository){
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    /**
     * Finds a refresh token by token
     *
     * @param token refresh token to search for
     * @return {@link Optional} containing the {@link RefreshToken}
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Creates a new refresh token for a given user
     *
     * @param username username of the user
     * @return {@link RefreshToken} object.
     */
    public RefreshToken createRefreshToken(String username) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(userRepository.findByUsername(username).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDuration));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    /**
     * Verifies if a given refresh token has expired
     *
     * @param token refresh token to verify
     * @return same refresh token if it is still valid
     * @throws TokenRefreshException if the token has expired
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired, please make a new signin request");
        }
        return token;
    }

    /**
     * Deletes all refresh tokens associated with a specific user ID
     *
     * @param userId ID of the user
     */
    @Transactional
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}