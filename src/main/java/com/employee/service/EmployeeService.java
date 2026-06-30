package com.employee.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.employee.dto.EmployeeProjectionInterface;
import com.employee.exception.EmployeeNotFoundException;
import com.employee.request.EmployeeAdditionRequest;
import com.employee.response.EmployeeResponse;

public interface EmployeeService {
	EmployeeResponse addEmployee(EmployeeAdditionRequest employeeAdditionRequest);

	Page<EmployeeResponse> getEmployees(int page, int size, String sortBy, String order);
	List<EmployeeProjectionInterface> getReports() throws EmployeeNotFoundException;

	
	EmployeeResponse updateEmployee(UUID id , EmployeeAdditionRequest employeeChangeRequest);
	
	Page<EmployeeResponse> searchEmployees(String query);
	
	void deleteEmployee(UUID publicId);
	int deleteEmployees(List<String> publicIds);
	int searchDelete(List<String> publicIds);
}
