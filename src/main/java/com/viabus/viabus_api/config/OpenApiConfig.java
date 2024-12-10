package com.viabus.viabus_api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Documentação da API ViaBus", version = "1.0", description = "Documentação da API para o ViaBus"))
public class OpenApiConfig {
}
