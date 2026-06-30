package com.employee.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.employee.dto.EmployeeProjectionInterface;
import com.employee.entity.Employee;
import com.employee.exception.EmployeeNotFoundException;
import com.employee.repository.EmployeeRepository;
import com.employee.request.EmployeeAdditionRequest;
import com.employee.response.EmployeeResponse;
import com.employee.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	private final EmployeeRepository employeeRepo;

	public EmployeeServiceImpl(EmployeeRepository employeeRepo) {
		this.employeeRepo = employeeRepo;
	}

	@Override
	public Page<EmployeeResponse> getEmployees(int page, int size, String sortBy, String order) {

		Sort sort = order.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Pageable pageable = PageRequest.of(page, size, sort);

		Page<EmployeeResponse> response = employeeRepo.findAll(pageable).map(employeeEntity -> {
			EmployeeResponse employeeResponse = new EmployeeResponse(employeeEntity);
			return employeeResponse;
		});

		return response;
	}

	@Override
	public List<EmployeeProjectionInterface> getReports() {
		// id = id of employee - who will report to others
		return employeeRepo.getCountAndEmployees();
	}

	@Override
	public Page<EmployeeResponse> searchEmployees(String query) {
		Pageable pageable = PageRequest.of(0, 1000);
		return employeeRepo.findByEmployeeNameContainingIgnoreCaseOrPositionContainingIgnoreCase(query, query, pageable)
				.map(employeeEntity -> {
					EmployeeResponse response = new EmployeeResponse(employeeEntity);
					return response;
				});
	}

	@Override
	@Transactional
	public EmployeeResponse addEmployee(EmployeeAdditionRequest employeeAdditionRequest)
			throws EmployeeNotFoundException {

		Employee employee = new Employee();
		employee.setEmployeeAge(employeeAdditionRequest.age());
		employee.setEmployeeName(employeeAdditionRequest.name());
		employee.setJoinDate(employeeAdditionRequest.joinDate());
		employee.setPosition(employeeAdditionRequest.position());
		employee.setSalary(employeeAdditionRequest.salary());
		Employee reportTo = null;
		if (employeeAdditionRequest.reportTo() != null) {
			reportTo = employeeRepo.findById(employeeAdditionRequest.reportTo().toString())
					.orElseThrow(() -> new EmployeeNotFoundException("The employee to report doesn't exist!"));
		}
		employee.setReportTo(reportTo);
		Employee savedEmployee = employeeRepo.save(employee);

		EmployeeResponse employeeResponse = new EmployeeResponse(savedEmployee);

		return employeeResponse;

	}

	@Override
	@Transactional
	public EmployeeResponse updateEmployee(UUID id, EmployeeAdditionRequest employeeChangeRequest)
			throws EmployeeNotFoundException {

		Employee employee = employeeRepo.findById(id.toString())
				.orElseThrow(() -> new EmployeeNotFoundException("The employee doesn't exist!"));

		if (employeeChangeRequest.reportTo() != null) {
			Employee employeeToReport = employeeRepo.findById(employeeChangeRequest.reportTo().toString())
					.orElseThrow(() -> new EmployeeNotFoundException("The employee to report doesn't exist!"));

			employee.setReportTo(employeeToReport);
		}

		employee.setEmployeeName(employeeChangeRequest.name());

		if (employeeChangeRequest.joinDate() != null) {
			employee.setJoinDate(employeeChangeRequest.joinDate());
		}

		if (employeeChangeRequest.position() != null) {
			employee.setPosition(employeeChangeRequest.position());
		}

		if (employeeChangeRequest.age() != 0) {
			employee.setEmployeeAge(employeeChangeRequest.age());
		}

		if (employeeChangeRequest.salary() != 0) {
			employee.setSalary(employeeChangeRequest.salary());
		}

		Employee savedEmp = employeeRepo.save(employee);

		EmployeeResponse employeeResponse = new EmployeeResponse(savedEmp);

		return employeeResponse;
	}

	@Override
	@Transactional
	public int deleteEmployees(List<String> publicIds) {

		employeeRepo.deleteAllByIdInBatch(publicIds);
		return publicIds.size();
	}

	@Override
	@Transactional
	public void deleteEmployee(UUID id) throws EmployeeNotFoundException {

		Employee employee = employeeRepo.findById(id.toString())
				.orElseThrow(() -> new EmployeeNotFoundException("Employee with id doesn't exist"));

		employeeRepo.delete(employee);

	}

	@Override
	@Transactional
	public int searchDelete(List<String> publicIds) {

		List<String> deletableIds = employeeRepo.findEmployeesWithNoReporters(); // sabh

		List<String> toDelete = publicIds.stream().filter(deletableIds::contains).toList();

		if (!toDelete.isEmpty()) {
			employeeRepo.deleteByIds(toDelete);
		} else {
			throw new EmployeeNotFoundException("None of employee are deletable");
		}
		return toDelete.size();
	}
}
