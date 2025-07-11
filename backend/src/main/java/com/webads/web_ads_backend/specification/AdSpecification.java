package com.webads.web_ads_backend.specification;

import com.webads.web_ads_backend.model.Ad;
import com.webads.web_ads_backend.model.Category;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AdSpecification {

    public static Specification<Ad> trueLiteral() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(criteriaBuilder.literal(true));
    }
    public static Specification<Ad> hasCategory(String category) {
        return (root, query, criteriaBuilder) -> {
            try {
                Category catEnum = Category.valueOf(category.toUpperCase());
                return criteriaBuilder.equal(root.get("category"), catEnum);
            } catch (IllegalArgumentException e) {
                return criteriaBuilder.disjunction();
            }
        };
    }

    public static Specification<Ad> nameContains(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Ad> priceGreaterThanOrEqual(Double minPrice) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Ad> priceLessThanOrEqual(Double maxPrice) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Ad> hasUserId(Long userId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId);
    }
}
