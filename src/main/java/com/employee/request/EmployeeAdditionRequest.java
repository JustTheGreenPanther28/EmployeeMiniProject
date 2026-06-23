package com.employee.request;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record EmployeeAdditionRequest(@NotNull String name,@Max(100) @Min(18) int age, String position, double salary, LocalDateTime joinDate, UUID reportTo) {
	
	
}
