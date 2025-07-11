package com.webads.web_ads_backend.controller;

import com.webads.web_ads_backend.dto.UserDTO;
import com.webads.web_ads_backend.dto.UserRegistrationDTO;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        User registeredUser = userService.register(registrationDTO);

        UserDTO userDTO = new UserDTO(registeredUser);
        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }
}
