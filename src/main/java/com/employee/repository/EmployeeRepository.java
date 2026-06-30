package com.employee.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.employee.dto.EmployeeProjectionInterface;
import com.employee.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

//	@Query("SELECT e FROM Employee e WHERE " + "LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :query, '%')) OR "
//			+ "LOWER(e.position) LIKE LOWER(CONCAT('%', :query, '%'))") <--- USING QUERY
	Page<Employee> findByEmployeeNameContainingIgnoreCaseOrPositionContainingIgnoreCase(String employeeName,
			String position);

	long countByReportTo(Employee reportTo);

	@Query(value = "SELECT e.employee_id, e.employee_name, COUNT(r.employee_id) as count " + "FROM employee e "
			+ "LEFT JOIN employee r ON r.report_to_id = e.employee_id "
			+ "GROUP BY e.employee_id, e.employee_name", nativeQuery = true)
	List<EmployeeProjectionInterface> getCountAndEmployees();

	//this basically means , the inner select query has the ids of employees who are being reported by others
	//the outer query has NOT IN which reverse the logic of selecting reporter that are not reporting to anyone
	@Query("SELECT e.employeeId FROM Employee e WHERE e.employeeId NOT IN " +
		       "(SELECT emp.employeeId FROM Employee emp " +
		       "INNER JOIN Employee reporter ON reporter.reportTo.employeeId = emp.employeeId)")
		List<String> findEmployeesWithNoReporters();
	
	@Modifying
	@Transactional
	@Query("DELETE FROM Employee e WHERE e.employeeId IN :ids")
	void deleteByIds(@Param("ids") List<String> ids);

	// pageable doesn't work native query

}
