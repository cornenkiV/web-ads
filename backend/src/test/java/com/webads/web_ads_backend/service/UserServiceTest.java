package com.webads.web_ads_backend.service;

import com.webads.web_ads_backend.dto.UserRegistrationDTO;
import com.webads.web_ads_backend.exceptions.ResourceNotFoundException;
import com.webads.web_ads_backend.exceptions.UserAlreadyExistsException;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserRegistrationDTO registrationDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("hashedPassword");

        registrationDTO = new UserRegistrationDTO();
        registrationDTO.setUsername("newuser");
        registrationDTO.setPassword("password123");
        registrationDTO.setPhoneNumber("123456789");
    }

    @Test
    void getUser_whenUserExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User foundUser = userService.getUser(1L);

        assertNotNull(foundUser);
        assertEquals("testuser", foundUser.getUsername());
    }

    @Test
    void getUser_whenUserDoesNotExist() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUser(99L);
        });
    }

    @Test
    void getUserByUsername_whenUserExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        User foundUser = userService.getUserByUsername("testuser");

        assertNotNull(foundUser);
        assertEquals(1L, foundUser.getId());
    }

    @Test
    void getUserByUsername_whenUserDoesNotExist() {
        when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserByUsername("unknownuser");
        });
    }


    @Test
    void register_whenUsernameIsAvailable() {
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword123");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(2L);
            return savedUser;
        });

        User registeredUser = userService.register(registrationDTO);

        assertNotNull(registeredUser);
        assertEquals("newuser", registeredUser.getUsername());
        assertEquals("hashedPassword123", registeredUser.getPassword());
        assertEquals("123456789", registeredUser.getPhoneNumber());
        assertNotNull(registeredUser.getRegistrationDate());

        verify(userRepository, times(1)).findByUsername("newuser");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_whenUsernameAlreadyExists() {
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.of(testUser));

        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.register(registrationDTO);
        });

        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}