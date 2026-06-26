package com.employee.configuration;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

    @Bean
    OpenAPI employeeApiConfig() {

        Contact contact = new Contact();
        contact.setName("Vedant");
        contact.setEmail("iet.scroll.in@gmail.com");

        Info info = new Info();
        info.setTitle("Employee Management API");
        info.setDescription("REST API for managing employees — add, update, delete, search, reporting hierarchy.");
        info.setVersion("v1.0.0");
        info.setContact(contact);

        ExternalDocumentation externalDocs = new ExternalDocumentation();
        externalDocs.setDescription("Project Repository");
        externalDocs.setUrl("");

        OpenAPI openAPI = new OpenAPI();
        openAPI.setInfo(info);
        openAPI.setExternalDocs(externalDocs);
        openAPI.setServers(List.of(
            new Server().url("http://localhost:1010").description("LOCAL")
        ));

        return openAPI;
    }
}
