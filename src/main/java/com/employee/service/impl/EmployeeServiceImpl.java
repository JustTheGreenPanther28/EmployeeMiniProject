package com.employee.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.employee.entity.Employee;
import com.employee.repository.EmployeeRepository;
import com.employee.request.EmployeeAdditionRequest;
import com.employee.response.EmployeeResponse;
import com.employee.response.ReportEmployee;
import com.employee.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	private final EmployeeRepository employeeRepo;

	public EmployeeServiceImpl(EmployeeRepository employeeRepo) {
		this.employeeRepo = employeeRepo;
	}

	@Override
	public Page<EmployeeResponse> getEmployees(int page, int size) {

		if (page <= -1 || size <= -1) {
			throw new RuntimeException("Invalid page number or size");
		}

		Pageable pageable = PageRequest.of(page, size);

		Page<EmployeeResponse> response = employeeRepo.findAll(pageable).map(employeeEntity -> {
			EmployeeResponse employeeResponse = new EmployeeResponse();
			employeeResponse.setEmployeeAge(employeeEntity.getEmployeeAge());
			employeeResponse.setEmployeeId(employeeEntity.getEmployeeId());
			employeeResponse.setEmployeeName(employeeEntity.getEmployeeName());
			employeeResponse.setJoinDate(employeeEntity.getJoinDate());
			employeeResponse.setPosition(employeeEntity.getPosition());
			employeeResponse.setSalary(employeeEntity.getSalary());
			return employeeResponse;
		});

		if (response == null) {
			throw new RuntimeException("Empty!");
		}
		return response;
	}

	@Override
	public List<ReportEmployee> getEmployeesReport(UUID id) {
		// id is id of employee - who will report to others
		if (id == null) {
			throw new RuntimeException("Id is Invalid!");
		}

		List<ReportEmployee> reportsTo = new ArrayList<>();
		Employee current = employeeRepo.findByEmployeeId(id);

		if (current == null) {
			throw new RuntimeException("Employee with id " + id + " doesn't exist!");
		}

		while (current.getReportTo() != null) {
			ReportEmployee reportTo = new ReportEmployee();

			reportTo.setId(current.getReportTo().getEmployeeId().toString());
			reportTo.setName(current.getReportTo().getEmployeeName());

			reportsTo.add(reportTo);
			current = current.getReportTo();
		}

		return reportsTo;
	}

	@Override
	@Transactional
	public boolean deleteEmployee(UUID id) {
		if (id == null) {
			throw new RuntimeException("The id " + id + " doesn't exist");
		}
		Employee employee = employeeRepo.findByEmployeeId(id);
		if (employee == null) {
			return false;
		}

		employeeRepo.delete(employee);

		return true;
	}

	@Override
	@Transactional
	public boolean addEmployee(EmployeeAdditionRequest employeeAdditionRequest) {

		Employee employee = new Employee();
		employee.setEmployeeAge(employeeAdditionRequest.age());
		employee.setEmployeeName(employeeAdditionRequest.name());
		employee.setJoinDate(employeeAdditionRequest.joinDate());
		employee.setPosition(employeeAdditionRequest.position());
		employee.setSalary(employeeAdditionRequest.salary());
		Employee reportTo = null;
		System.out.println(employeeAdditionRequest.reportTo());
		if (employeeAdditionRequest.reportTo() != null) {
			reportTo = employeeRepo.findByEmployeeId(employeeAdditionRequest.reportTo());

		}
		employee.setReportTo(reportTo);
		employeeRepo.save(employee);

		return true;
	}

//	public byte[] uuidToArray(UUID id) {
//		ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
//		bb.putLong(id.getMostSignificantBits());
//		bb.putLong(id.getLeastSignificantBits());
//		byte[] bytes = bb.array();
//		return bytes;
//	}

}
