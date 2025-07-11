package com.webads.web_ads_backend.specification;

import com.webads.web_ads_backend.model.Ad;
import org.springframework.data.jpa.domain.Specification;

public class AdSpecificationBuilder {

    private Specification<Ad> specification;

    public AdSpecificationBuilder() {
        this.specification = AdSpecification.trueLiteral();
    }

    public AdSpecificationBuilder withCategory(String category) {
        if (category != null && !category.isEmpty()) {
            specification = specification.and(AdSpecification.hasCategory(category));
        }
        return this;
    }

    public AdSpecificationBuilder withName(String name) {
        if (name != null && !name.isEmpty()) {
            specification = specification.and(AdSpecification.nameContains(name));
        }
        return this;
    }

    public AdSpecificationBuilder withMinPrice(Double minPrice) {
        if (minPrice != null) {
            specification = specification.and(AdSpecification.priceGreaterThanOrEqual(minPrice));
        }
        return this;
    }

    public AdSpecificationBuilder withMaxPrice(Double maxPrice) {
        if (maxPrice != null) {
            specification = specification.and(AdSpecification.priceLessThanOrEqual(maxPrice));
        }
        return this;
    }

    public AdSpecificationBuilder withUserId(Long userId) {
        if (userId != null) {
            specification = specification.and(AdSpecification.hasUserId(userId));
        }
        return this;
    }

    public Specification<Ad> build() {
        return specification;
    }
}
