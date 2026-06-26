package com.employee.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.employee.request.EmployeeAdditionRequest;
import com.employee.response.EmployeeResponse;
import com.employee.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE,
		RequestMethod.PATCH })
@Tag(name = "Employee Management", description = "APIs for managing employees — add, update, delete, search, and reporting hierarchy")
public class EmployeeController {

	private final EmployeeService employeeService;

	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@Operation(summary = "Add a new employee")
	@PostMapping
	public ResponseEntity<?> addEmployees(@Valid @RequestBody EmployeeAdditionRequest employeeAdditionRequest) {
		return ResponseEntity.status(HttpStatusCode.valueOf(201))
				.body(employeeService.addEmployee(employeeAdditionRequest));
	}

	@Operation(summary = "Get all employees with pagination and sorting")
	@GetMapping
	public ResponseEntity<Page<EmployeeResponse>> getEmployees(@RequestParam @Min(0) int page,
			@RequestParam @Min(0) int size, @RequestParam(defaultValue = "employeeName") String sortBy,
			@RequestParam(defaultValue = "asc") String order) {
		return ResponseEntity.ok(employeeService.getEmployees(page, size, sortBy, order));
	}

	@Operation(summary = "Get reporting hierarchy of an employee by ID")
	@GetMapping("/report/{id}")
	public ResponseEntity<?> getReportOfAEmployee(@PathVariable @NotNull UUID id) {
		return ResponseEntity.ok(employeeService.getEmployeesReport(id));
	}

	@Operation(summary = "Delete an employee by ID")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteEmployee(@PathVariable @NotNull String id) {
		employeeService.deleteEmployee(UUID.fromString(id));
		return ResponseEntity.status(HttpStatusCode.valueOf(204)).build();
	}

	@Operation(summary = "Delete multiple employees by list of IDs")
	@DeleteMapping("/ids")
	public ResponseEntity<Void> deleteEmployees(@Valid @NotNull @RequestBody List<String> ids) {
		if (employeeService.deleteEmployees(ids)) {
			return ResponseEntity.status(HttpStatusCode.valueOf(204)).build();
		}
		return ResponseEntity.badRequest().build();
	}

	@Operation(summary = "Update employee details by ID")
	@PatchMapping("/{id}")
	public ResponseEntity<EmployeeResponse> updateEmployees(@PathVariable @NotNull UUID id,
			@Valid @RequestBody EmployeeAdditionRequest employeeChangeRequest) {
		return ResponseEntity.ok(employeeService.updateEmployee(id, employeeChangeRequest));
	}

	@Operation(summary = "Search employees by name or position")
	@GetMapping("/search")
	public ResponseEntity<Page<EmployeeResponse>> searchEmployees(@RequestParam String query,
			@RequestParam @Min(0) int page, @RequestParam int size) {
		return ResponseEntity.ok(employeeService.searchEmployees(query, page, size));
	}

}