let employees = [];
let page = prompt("Enter page number : ")
let size = prompt("Enter page size : ")
if(page==undefined || size==undefined || isNaN(page) || isNaN(size) || page<0 || size<=0){
    page=0;
    size=10;
}
async function fetchEmployees(page, size) {
    try {
        let response = await fetch(`http://localhost:8080/employee?page=${page}&size=${size}`);
        if (response.ok) {
            let data = await response.json();
            employees = data.content;
        } else {
            const error = await response.json();
            alert("Error fetching employees: " + error.message);
        }
    } catch (error) {
        alert("Error fetching employees: " + error.message);
    }
    return employees;
}

async function init() {
    let employeeValues = await fetchEmployees(page, size);
    let tb = document.getElementById("table-body");

    for (let employee of employeeValues) {
        let newRow = `
        <tr>
            <td><input type="checkbox" name="employeeSelect" value="${employee.employeeId}"></td>
            <td>${employee.employeeId}</td>
            <td>${employee.employeeName}</td>
            <td>${employee.employeeAge}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${new Date(employee.joinDate).toLocaleDateString()}</td>
            <td><button class="reportToBtn" data-id="${employee.employeeId}">Report To</button></td>
        </tr>`;
        tb.insertAdjacentHTML("beforeend", newRow);
    }

    document.querySelectorAll(".reportToBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
            let id = btn.dataset.id;
            const response = await fetch(`http://localhost:8080/employee/report/${id}`);
            if (response.ok) {
                let data = await response.json();
                if(data==undefined || data.length==0){
                    alert("No employees to report to.");
                }
                for(let i=0; i<data.length; i++){
                    alert("Id and name of " + i+1 + " employee to report: " + data[i].id + " Name: " + data[i].name);
                }
            } else {
                const error = await response.json();
                alert("Failed to fetch report: " + error.message);
            }
        });
    });

    document.getElementById("add").addEventListener("click", () => {
        window.open("add.html", "iframe", "width=600,height=400");
    });

    document.getElementById("delete").addEventListener("click", async () => {
        let checkboxes = document.querySelectorAll('input[name="employeeSelect"]:checked');
        if (checkboxes.length === 0) {
            alert("No employees selected.");
            return;
        }

        let ids = Array.from(checkboxes).map(cb => cb.value);

        for (let id of ids) {
            const response = await fetch(`http://localhost:8080/employee/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                document.querySelector(`input[value="${id}"]`).closest("tr").remove();
            } else {
                const text = await response.text();
                const message = text ? JSON.parse(text).message : response.statusText;
                alert(`Failed to delete ${id}: ` + message);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", init);