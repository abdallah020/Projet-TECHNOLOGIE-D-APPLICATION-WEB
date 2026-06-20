package com.universite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.universite.repository")
@ComponentScan(basePackages = "com.universite")
public class UniversiteAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniversiteAppApplication.class, args);
    }
}
