package com.webads.web_ads_backend.service;

import com.webads.web_ads_backend.exceptions.ResourceNotFoundException;
import com.webads.web_ads_backend.exceptions.UserAlreadyExistsException;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.webads.web_ads_backend.dto.UserRegistrationDTO;

import java.time.LocalDate;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    /**
     * Finds user by ID
     *
     * @param id user id
     * @return User object
     * @throws RuntimeException if user doesnt exist
     */
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id: " + id + " not found."));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User witn username: " + username + " not found"));
    }


    public User register(UserRegistrationDTO registrationDTO) {
        if (userRepository.findByUsername(registrationDTO.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username '" + registrationDTO.getUsername() + "' already exists.");
        }

        User newUser = new User();
        newUser.setUsername(registrationDTO.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        newUser.setPhoneNumber(registrationDTO.getPhoneNumber());
        newUser.setRegistrationDate(LocalDate.now());

        return userRepository.save(newUser);
    }
}
