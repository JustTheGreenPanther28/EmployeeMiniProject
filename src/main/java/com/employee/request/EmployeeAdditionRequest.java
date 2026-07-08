package com.employee.request;

import java.time.LocalDateTime;
import java.util.UUID;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record EmployeeAdditionRequest(@NotNull String name,@Min(18) @Max(300) int age, @Nullable String position, @Min(0) double salary, LocalDateTime joinDate, @Valid UUID reportTo) {
	
	
}
