let employees = [];
const api = "http://localhost:1010/api/v1/employee";
let size = 15;
let totalPages = 0;
let currPage = 0;
let sortBy = "employeeName";
let order = "asc";
let submitBtn = document.getElementById("submit-btn");

const names = [
    "Rahul Sharma", "Priya Singh", "Amit Kumar", "Neha Gupta", "Raj Patel",
    "Anjali Verma", "Vikram Mehta", "Pooja Joshi", "Arjun Nair", "Sneha Iyer",
    "Rohan Desai", "Kavita Reddy", "Suresh Yadav", "Deepika Pillai", "Manish Tiwari",
    "Riya Kapoor", "Karan Malhotra", "Simran Kaur", "Aditya Bhatt", "Shruti Pandey",
    "Varun Saxena", "Nisha Jain", "Mohit Agarwal", "Divya Mishra", "Sanjay Dubey",
    "Ananya Krishnan", "Gaurav Shukla", "Tanvi Choudhary", "Nikhil Banerjee", "Pallavi Sen",
    "Vishal Rawat", "Meera Nambiar", "Akash Tripathi", "Ritu Srivastava", "Harsh Vardhan",
    "Swati Kulkarni", "Pranav Doshi", "Ishaan Chatterjee", "Lavanya Menon", "Kunal Bose",
    "Aditi Ghosh", "Yash Thakur", "Nandini Rao", "Siddharth Naik", "Kritika Bajaj",
    "Abhinav Pandya", "Shraddha Patil", "Tarun Mathur", "Komal Shah", "Dhruv Rathore"
];

const positions = [
    "SDE", "SDE II", "Senior SDE", "Intern", "Team Lead",
    "Engineering Manager", "DevOps Engineer", "QA Engineer",
    "Product Manager", "Data Analyst", "Backend Developer",
    "Frontend Developer", "Full Stack Developer", "Cloud Architect"
];


function showAlert(message, success, position = "body") {
    let alert, msg;

    if (position === "form") {
        const form = document.getElementById("add-form");
        alert = document.getElementsByClassName("alert-form")[0];
        msg = document.getElementsByClassName("alert-form-message")[0];

        if (!success) {
            form?.classList.add("shake");
            if (form) form.style.borderColor = "crimson";
            alert.style.backgroundColor = "#f8d7da";
            alert.style.borderColor = "#f1aeb5";
            msg.style.color = "#842029";
        } else {
            alert.style.backgroundColor = "#d1e7dd";
            alert.style.borderColor = "#badbcc";
            msg.style.color = "#176842";
        }

    } else {
        alert = document.getElementsByClassName("alert")[0];
        msg = document.getElementsByClassName("alert-message")[0];
        const alertHeading = document.getElementsByClassName("alert-heading")[0];

        if (!success) {
            if (alertHeading) {
                alertHeading.style.color = "red";
                alertHeading.style.textDecorationColor = "rgb(149, 20, 45)";
            }
            document.body.classList.add("shake-body");
        } else {
            if (alertHeading) {
                alertHeading.style.color = "yellowgreen";
                alertHeading.style.textDecorationColor = "#176842";
            }
        }
    }

    if (!alert || !msg) {
        console.warn("showAlert: element not found for position =", position);
        return;
    }

    msg.textContent = message;
    alert.style.display = "flex";
    document.body.classList.add("blocked");

    setTimeout(() => {
        alert.style.display = "none";
        msg.textContent = "";
        document.body.classList.remove("blocked");
        document.body.classList.remove("shake-body");

        const form = document.getElementById("add-form");
        if (form) {
            form.style.borderColor = "#176842";
            form.classList.remove("shake");
        }
    }, 5000);
}


async function fetchEmployees(page, size, sortBy, order) {
    try {
        let response = await fetch(api + `?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`);
        if (response.ok) {
            let data = await response.json();
            employees = data.content;
            totalPages = data.totalPages;
        } else {
            showAlert("Error Occured, Unable fetch the data", false);
        }
    } catch (error) {
        showAlert("Error Occured, Unable fetch the data", false);
    }
    return employees;
}

async function addEmployeeToReport() {

    const response = await fetch(api + "?report=true", {
        method: "GET"
    })

    if (response.ok) {

        let data = await response.json();

        console.log(data);

        if (data == undefined || data == null || data == "") {
            return;
        }
        let reportTo = document.getElementById('report-to');
        reportTo.innerHTML = `<option value="" id="none">-- None --</option>`;

        for (let countAndName of data) {
            let newOption = new Option(`${countAndName.employeeName}  (${countAndName.count})`, `${countAndName.employeeId}`);
            reportTo.add(newOption);
        }
    }
}

function buildRow(employee) {
    return `
    <tr>
        <td><input type="checkbox" name="employeeSelect" value="${employee.employeeId}" class="child-boxes"></td>
        <td>${employee.employeeName}</td>
        <td>${employee.employeeAge}</td>
        <td>${employee.position}</td>
        <td>${employee.salary}</td>
        <td>${new Date(employee.joinDate).toLocaleDateString()}</td>
        <td><button class="reportToBtn" reporter="${employee.employeeName}" reportTo="${employee.reportTo ? employee.reportTo.reportToName : ''}">Report To</button></td>
        <td><button class="editBtn"
        data-id="${employee.employeeId}"
        name="${employee.employeeName}"
        age="${employee.employeeAge}"
        position="${employee.position}"
        salary="${employee.salary}"
        joinDate="${employee.joinDate}"
        reportToId="${employee.reportTo ? employee.reportTo.reportToId : ''}">
        <img src="img.png" width=20px height=20px>
        </button>
        <button class="individual-delete" data-id="${employee.employeeId}" name="${employee.employeeName}">
        <img src="bin.png" width=25px height=25px>
        </button></td>
    </tr>`;
}

function attachRowListeners() {
    document.querySelectorAll(".reportToBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            let reporter = btn.getAttribute("reporter");
            let reportTo = btn.getAttribute("reportTo");
            if (!reportTo || reportTo === "null") {
                showAlert(reporter + " doesn't need to report anyone", true);
            } else {
                showAlert('"' + reporter + '"' + " must report to " + '"' + reportTo + '"', true);
            }
        });
    });

    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-id");
            let editform = document.getElementById('add-form');
            editform.children[0].textContent = "Edit Employee";
            editform.style.display = 'flex';
            document.body.classList.add('blocked');

            document.getElementById('employeeName').value = btn.getAttribute('name');
            document.getElementById('employeeAge').value = btn.getAttribute('age');
            document.getElementById('position').value = btn.getAttribute('position') || "";
            document.getElementById('salary').value = btn.getAttribute('salary');
            document.getElementById('joinDate').value = btn.getAttribute('joinDate').split("T")[0];
            document.getElementById('report-to').value = btn.getAttribute('reportToId') || "";

            submitBtn.replaceWith(submitBtn.cloneNode(true));
            submitBtn = document.getElementById("submit-btn");
            submitBtn.value = "Edit Employee";
            submitBtn.addEventListener("click", () => submit(id));
        });
    });

    document.querySelectorAll('.individual-delete').forEach(btn => {
        btn.addEventListener("click", async () => {
            let id = btn.getAttribute('data-id');

            try {
                const response = await fetch(api + `/${id}`, {
                    method: "DELETE",
                });

                if (response.status == 204) {
                    showAlert(`${btn.getAttribute('name')} Deleted!`, true);
                    init();
                } else {
                    showAlert(`Failed to delete ${btn.getAttribute('name')}, as other people report to him!`, false);
                }
            } catch (error) {
                showAlert("Failed: " + error.message, false);
            }
        });
    });
}

async function searchEmployees(query) {
    try {
        const response = await fetch(api + `?searchQuery=${encodeURIComponent(query)}`);
        if (response.ok) {
            let data = await response.json();
            let tb = document.getElementById("table-body");
            tb.innerHTML = "";
            document.getElementById("curr-page").textContent = `Search results: ${data.totalElements} found`;
            prevPage.disabled = true;
            nextPage.disabled = true;

            for (let employee of data.content) {
                tb.insertAdjacentHTML("beforeend", buildRow(employee));
            }

            attachRowListeners();
        } else {
            showAlert("Search failed!", false);
        }
    } catch (error) {
        showAlert("Error occurred while searching", false);
    }
}

async function submit(id = null) {
    event.preventDefault();
    submitBtn.style.borderColor = "black";
    clearAllFieldErrors();

    let employeeName = document.getElementById("employeeName").value;
    let employeeAge = document.getElementById("employeeAge").value;
    let position = document.getElementById("position").value;
    let salary = document.getElementById("salary").value;
    let joinDate = document.getElementById("joinDate").value;
    let reportTo = document.getElementById("report-to").value;

    if (joinDate == undefined || joinDate == "") {
        joinDate = new Date().toISOString();
    } else {
        joinDate = joinDate + "T00:00:00Z";
    }

    let hasError = false;

    if (!isNaN(employeeName) || employeeName.trim() === "" || employeeName.length > 100) {
        setFieldError("employeeName", "Please enter a valid name.");
        hasError = true;
    }
    if (employeeAge === "" || isNaN(employeeAge) || employeeAge < 18 || employeeAge >= 300) {
        setFieldError("employeeAge", "Age must be 18 or older.");
        hasError = true;
    }
    if (position === "") {
        setFieldError("position", "Please select a position.");
        hasError = true;
    }
    if (salary === "" || isNaN(salary) || parseFloat(salary) < 0) {
        setFieldError("salary", "Please enter a valid salary.");
        hasError = true;
    }

    if (hasError) return;

    let payload = {
        name: employeeName,
        age: parseInt(employeeAge),
        position: position,
        salary: parseFloat(salary),
        joinDate: joinDate,
        reportTo: reportTo
    }
    let response;
    try {
        if (id == null) {
            response = await fetch(api,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
            if (response.ok) {
                showAlert("Employee added!", true);
                init();
                document.getElementById('add-form-form').reset();
                document.getElementById('add-form').style.display = 'none';
                document.body.classList.remove('blocked');
                return;
            } else {
                const error = await response.json();
                showAlert("Failed: " + error.message, false, "form");
                return;
            }
        } else {
            response = await fetch(api + `/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
            if (response.ok) {
                showAlert("Employee edited!", true);
                init();
                document.getElementById('add-form-form').reset();
                document.getElementById('add-form').style.display = 'none';
                document.body.classList.remove('blocked');
                return;
            } else {
                const error = await response.json();
                showAlert("Failed: Kindly enter valid values", false, "form");
                return;
            }
        }
    } catch (error) {
        showAlert("Failed: " + error.message, false);
    }
}

function setFieldError(fieldId, message) {
    document.getElementById(fieldId).classList.add("input-error");
    document.getElementById(fieldId + "-error").textContent = message;
}

function clearFieldError(fieldId) {
    document.getElementById(fieldId).classList.remove("input-error");
    document.getElementById(fieldId + "-error").textContent = "";
}

function clearAllFieldErrors() {
    document.querySelectorAll(".input-error").forEach(field => {
        field.classList.remove("input-error");
    });
    document.querySelectorAll(".field-error").forEach(span => {
        span.textContent = "";
    });
}

async function init() {
    let employeeValues = await fetchEmployees(currPage, size, sortBy, order);

    let currentPage = document.getElementById("curr-page");
    if (totalPages !== 0) {
        currentPage.textContent = `Page ${currPage + 1} of ${totalPages}`;
    } else {
        currentPage.textContent = `Page ${currPage} of ${totalPages}`;
    }

    let tb = document.getElementById("table-body");
    tb.innerHTML = "";

    for (let employee of employeeValues) {
        tb.insertAdjacentHTML("beforeend", buildRow(employee));
    }

    prevPage.disabled = currPage === 0;
    nextPage.disabled = currPage >= totalPages - 1;

    attachRowListeners();
    addEmployeeToReport();
}


document.getElementById("add-btn").addEventListener("click", () => {
    let addform = document.getElementById('add-form');
    addform.children[0].textContent = "Employee Details";
    addform.style.display = 'flex';
    document.body.classList.add('blocked');
    submitBtn.replaceWith(submitBtn.cloneNode(true));
    submitBtn = document.getElementById("submit-btn");
    submitBtn.value = "Add Employee";
    submitBtn.addEventListener("click", () => submit());
});

document.getElementById('cross').addEventListener("click", () => {
    let addform = document.getElementById('add-form');
    document.body.classList.remove('blocked');
    addform.style.display = 'none';
    document.getElementById('add-form-form').reset();
});

let deletebtn = document.getElementById("delete-btn");
deletebtn.addEventListener("click", async () => {
    let checkboxes = document.querySelectorAll('input[name="employeeSelect"]:checked');
    if (checkboxes.length === 0) {
        showAlert("No employee is selected!", false);
        return;
    }

    let ids = Array.from(checkboxes).map(checkbox => checkbox.value);

    try {
        const response = await fetch(api, {
            method: "DELETE",
            body: JSON.stringify(ids),
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            const json = await response.json();
            showAlert(json.deletionCount + " Employee(s) Successfully deleted!", true);
            init();
        } else {
            const text = await response.text();
            if (checkboxes.length == 1) {
                showAlert(`Failed to delete, as one of id is a reporter`, false);
                return;
            } else {
                let takenInput = document.getElementById('take-input');
                takenInput.style.display = 'flex';
                document.body.classList.add('blocked');

                document.getElementById('yes').addEventListener("click", async () => {
                    const response = await fetch(api + `?searchDelete=true`, {
                        method: "DELETE",
                        body: JSON.stringify(ids),
                        headers: { "Content-Type": "application/json" }
                    });
                    if (response.ok) {
                        showAlert("loading...", true);
                        const json1 = await response.json();
                        showAlert(json1.deletionCount + " Employees (who were not referenced by other employees) were Removed", true);
                        takenInput.style.display = 'none';
                        document.body.classList.remove('blocked');
                        init();
                    } else {
                        showAlert("Employee(s) can't be deleted!", false);
                        takenInput.style.display = 'none';
                        document.body.classList.remove('blocked');
                    }
                });
                document.getElementById("no").addEventListener("click", () => {
                    takenInput.style.display = 'none';
                    document.body.classList.remove('blocked');
                    showAlert("Deletion canceled!", true);
                });
            }
        }
    } catch (error) {
        showAlert("Unable to delete employees!", false);
    }
    document.getElementById("all").checked = false;
});


let all = document.getElementById("all");
all.addEventListener("click", () => {
    let childboxes = document.querySelectorAll(".child-boxes")
    childboxes.forEach(childbox => {
        childbox.checked = all.checked;
    });
});


let prevPage = document.getElementById('prev-page');
prevPage.addEventListener("click", () => {
    if (currPage == 0) {
        prevPage.disabled = true;
        return;
    }
    currPage--;
    init();
});

let nextPage = document.getElementById('next-page');
nextPage.addEventListener("click", () => {
    if (currPage == totalPages - 1) {
        nextPage.disabled = true;
        return;
    }
    currPage++;
    init();
})


let sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener("change", () => {
    currPage = 0;
    let values = sortSelect.value.split(',');
    sortBy = values[0];
    order = values[1];
    init();
})


const headers = ["head-name", "head-age", "head-position", "head-salary", "head-joinDate"];
headers.forEach(id => {
    const btn = document.getElementById(id);
    btn.dataset.order = "asc";
    btn.addEventListener("click", () => {
        btn.dataset.order = btn.dataset.order === "asc" ? "desc" : "asc";
        sortBy = btn.value;
        order = btn.dataset.order;
        currPage = 0;
        init();
    });
});

let searchInput = document.getElementById("search-input");
let searchTimeout;

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    let query = searchInput.value.trim();

    if (query.length === 0) {
        currPage = 0;
        init();
        return;
    }

    if (query.length < 3) return;

    searchTimeout = setTimeout(() => {
        searchEmployees(query);
    }, 300);
});

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", addEmployeeToReport);