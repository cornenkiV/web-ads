package com.webads.web_ads_backend.dbseeder;

import com.github.javafaker.Faker;
import com.webads.web_ads_backend.model.Ad;
import com.webads.web_ads_backend.model.Category;
import com.webads.web_ads_backend.model.User;
import com.webads.web_ads_backend.repository.AdRepository;
import com.webads.web_ads_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {


    private final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${db.seed}")
    private boolean recreateOnStartup;

    private final Faker faker = new Faker();

    @Override
    public void run(String... args) throws Exception {
        if (recreateOnStartup) {
            logger.info("seeding data...");
            seedUsers();
            seedAds();
            logger.info("db seeding finished");
        } else {
            logger.info("Skipping seeding.");
        }
    }

    private void seedUsers() {
        logger.info("seeding users...");
        List<User> users = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            User user = new User();
            user.setUsername(faker.name().username());
            user.setPassword(passwordEncoder.encode("password"));
            user.setPhoneNumber(faker.phoneNumber().cellPhone());
            user.setRegistrationDate(LocalDate.now().minusDays(faker.number().numberBetween(1, 365)));
            users.add(user);
        }
        userRepository.saveAll(users);
        logger.info("users seeded");
    }

    private void seedAds() {
        logger.info("seeding ads...");
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            logger.warn("no users found, skipping seeding");
            return;
        }

        List<Ad> ads = new ArrayList<>();
        Category[] categories = Category.values();

        for (int i = 0; i < 100; i++) {
            Ad ad = new Ad();
            ad.setName(faker.commerce().productName());
            ad.setDescription(faker.lorem().paragraph(3));
            ad.setImageUrl("https://picsum.photos/seed/" + faker.lorem().word() + "/400/300");
            ad.setPrice(faker.number().randomDouble(2, 10, 1000));
            ad.setCity(faker.address().city());
            ad.setPostDate(LocalDateTime.now().minusDays(faker.number().numberBetween(0, 30)));
            ad.setCategory(categories[faker.number().numberBetween(0, categories.length)]);
            ad.setUser(users.get(faker.number().numberBetween(0, users.size())));

            ads.add(ad);
        }
        adRepository.saveAll(ads);
        logger.info("ads seeded");
    }
}