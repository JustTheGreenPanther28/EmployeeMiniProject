package com.employee.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
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

import com.employee.exception.InvalidDemandException;
import com.employee.request.EmployeeAdditionRequest;
import com.employee.response.EmployeeResponse;
import com.employee.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("api/v1/employee")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE,
		RequestMethod.PATCH, RequestMethod.OPTIONS })
@Tag(name = "Employee Management", description = "APIs for managing employees — add, update, delete, search, and reporting hierarchy")
public class EmployeeController {

	private final EmployeeService employeeService;

	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@Operation(summary = "Add a new employee")
	@PostMapping
	public ResponseEntity<?> addEmployees(@Valid @RequestBody EmployeeAdditionRequest employeeAdditionRequest) {
		return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.addEmployee(employeeAdditionRequest));
	}

	@Operation(summary = "Update employee details by ID")
	@PatchMapping("/{id}")
	public ResponseEntity<EmployeeResponse> updateEmployees(@PathVariable @NotNull UUID id,
			@Valid @RequestBody EmployeeAdditionRequest employeeChangeRequest) {
		return ResponseEntity.ok(employeeService.updateEmployee(id, employeeChangeRequest));
	}

	@Operation(summary = "Get all employees with pagination and sorting, Searching and get report")
	@GetMapping
	public ResponseEntity<?> getEmployees(@RequestParam(defaultValue = "0") @Min(0) int page,
			@RequestParam(defaultValue = "5") @Min(0) int size,
			@RequestParam(defaultValue = "employeeName") String sortBy,
			@RequestParam(defaultValue = "asc") String order, @RequestParam(defaultValue = "") String searchQuery,
			@RequestParam(defaultValue = "false") boolean report) {
		if (!searchQuery.isBlank() && report) {
			throw new InvalidDemandException("You can't invoke report and search at same time!");
		}
		if (report) {
			return ResponseEntity.ok(employeeService.getReports());
		}
		if (!searchQuery.isBlank()) {
			return ResponseEntity.ok(employeeService.searchEmployees(searchQuery));
		}
		return ResponseEntity.ok(employeeService.getEmployees(page, size, sortBy, order));
	}

	@Operation(summary = "Delete an employee by ID")
	@DeleteMapping({ "", "/{id}" })
	public ResponseEntity<?> deleteEmployee(@PathVariable(required = false) String id,
			@RequestBody(required = false) List<String> ids,
			@RequestParam(defaultValue = "false") boolean searchDelete) {

		if (id == null && ids == null) {
			throw new InvalidDemandException("Id(s) to delete is not provided");
		}
		if (id != null && ids != null) {
			throw new InvalidDemandException("Please be specific with deletion");
		}
		if ((searchDelete && ids == null) || (searchDelete && id != null)) {
			throw new InvalidDemandException("Search delete is applied on bulk deletion");
		}
		if (id != null) {
			employeeService.deleteEmployee(UUID.fromString(id));
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
		if (searchDelete) {
			int numberOfDeletedIds = employeeService.searchDelete(ids);
			return ResponseEntity.ok()
					.body(Map.of("deletionCount", numberOfDeletedIds, "skippedCount", ids.size() - numberOfDeletedIds));
		}

		int numberOfDeletedIds = employeeService.deleteEmployees(ids);
		return ResponseEntity.ok()
				.body(Map.of("deletionCount", numberOfDeletedIds, "skippedCount", ids.size() - numberOfDeletedIds));
	}

}