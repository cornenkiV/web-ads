package com.webads.web_ads_backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAdDTO {

    @NotEmpty(message = "Ad name is required")
    private String name;

    private String description;
    private String imageUrl;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be zero or more")
    private Double price;

    @NotEmpty(message = "Category is required")
    private String category;

    @NotEmpty(message = "City is required")
    private String city;
}