let employees = [];
const api = "http://localhost:1010/api/v1/employee";
let size = 5;
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
            const error = await response.json();
            showAlert("Error Occured, Unable fetch the data", success = false);
        }
    } catch (error) {
        showAlert("Error Occured, Unable fetch the data", success = false);
    }
    return employees;
}

// employee report to in additon of employee
async function addEmployeeToReport() {

    const response = await fetch(api+ "?report=true", {
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
            //option has text and value
            let newOption = new Option(`${countAndName.employeeName}  (${countAndName.count})`, `${countAndName.employeeId}`);
            reportTo.add(newOption);
        }
    }
}

async function searchEmployees(query) {
    try {
        //URLs can't contain spaces, &, =, ? that's why encodeURIComponent
        const response = await fetch(api + `?searchQuery=${encodeURIComponent(query)}`);
        if (response.ok) {
            let data = await response.json();
            let tb = document.getElementById("table-body");
            tb.innerHTML = "";
            document.getElementById("curr-page").textContent = `Search results: ${data.totalElements} found`;
            prevPage.disabled = true;
            nextPage.disabled = true;

            for (let employee of data.content) {
                let newRow = `
                <tr>
                    <td><input type="checkbox" name="employeeSelect" value="${employee.employeeId}" class="child-boxes"></td>
                    <td>${employee.employeeName}</td>
                    <td>${employee.employeeAge}</td>
                    <td>${employee.position}</td>
                    <td>${employee.salary}</td>
                    <td>${new Date(employee.joinDate).toLocaleDateString()}</td>
                    <td><button class="reportToBtn" data-id="${employee.employeeId}">Report To</button></td>
                    <td><button class="editBtn" data-id="${employee.employeeId}">Edit</button></td>
                </tr>`;
                tb.insertAdjacentHTML("beforeend", newRow);
            }
        } else {
            showAlert("Search failed!");
        }
    } catch (error) {
        showAlert("Error occurred while searching");
    }
}

//Adding employees
async function submit(id = null) {
    event.preventDefault();
    // submitBtn.disable = true;
    submitBtn.style.borderColor = "black";


    let employeeName = document.getElementById("employeeName").value;
    let employeeAge = document.getElementById("employeeAge").value;
    let position = document.getElementById("position").value;
    let salary = document.getElementById("salary").value;
    let joinDate = document.getElementById("joinDate").value;
    let reportTo = document.getElementById("report-to").value;

    if (joinDate == undefined || joinDate == "") {
        joinDate = new Date().toISOString();
    }
    else {
        joinDate = joinDate + "T00:00:00Z";
    }
    if (!isNaN(employeeName) || employeeName == "" || employeeName.length === 0 || employeeName.length > 100) {
        showAlert("Please enter a valid name!", success = false, position = "form");
        return;
    }
    if (employeeAge == undefined || employeeAge == "" || isNaN(employeeAge) || employeeAge < 18 || employeeAge >= 300) {
        showAlert("Please enter a valid age (must be 18 or older).", success = false, position = "form");
        return;
    }

    if (salary == "" || salary == undefined || parseFloat(salary) < 0) {
        showAlert("Please enter a valid salary!", success = false, position = "form");
        return;
    }

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
                showAlert("Employee added!", success = true);
                init();
                document.getElementById('add-form-form').reset();
                document.getElementById('add-form').style.display = 'none';
                submitBtn.disable = true;
                return;
            } else {
                const error = await response.json();
                showAlert("Failed: " + error.message, success = false, position = "form");
                return;
            }
        }
        else {
            response = await fetch(api + `/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
            if (response.ok) {
                showAlert("Employee edited!", success = true);
                init();
                document.getElementById('add-form-form').reset();
                document.getElementById('add-form').style.display = 'none';
                return;
            } else {
                const error = await response.json();
                showAlert("Failed: Kindly enter valid values", success = false, position = "form");
                return;
            }
        }
    } catch (error) {
        showAlert("Failed: " + error.message, success = false);
    }
}


async function init() {
    let employeeValues = await fetchEmployees(currPage, size, sortBy, order);

    let currentPage = document.getElementById("curr-page");
    if (totalPages !== 0) {
        currentPage.textContent = `Page ${currPage + 1} of ${totalPages}`;
    }
    else {
        currentPage.textContent = `Page ${currPage} of ${totalPages}`;
    }

    let tb = document.getElementById("table-body");
    tb.innerHTML = "";

    for (let employee of employeeValues) {
        let newRow = `
        <tr>
            <td><input type="checkbox" name="employeeSelect" value="${employee.employeeId}" class="child-boxes"></td>
            <td>${employee.employeeName}</td>
            <td>${employee.employeeAge}</td>
            <td>${employee.position}</td>
            <td>${employee.salary}</td>
            <td>${new Date(employee.joinDate).toLocaleDateString()}</td>
            <td><button class="reportToBtn" data-id="${employee.employeeId}" reporter="${employee.reportTo.reporter}" reportTo="${employee.reportTo.reportTo}">Report To</button></td>
            <td><button class="editBtn" 
            data-id = "${employee.employeeId}" 
            name = "${employee.employeeName}"
            age = "${employee.employeeAge}"
            position = "${employee.position}"
            salary = "${employee.salary}"
            joinDate = "${employee.joinDate}">

            <img src="img.png" width=20px height=20px>
            </button>
            <button class="individual-delete" data-id="${employee.employeeId}" name = "${employee.employeeName}">
            <img src="bin.png" width=25px height=25px>
            </button></td>

        </tr>`;
        tb.insertAdjacentHTML("beforeend", newRow);
    }

    prevPage.disabled = currPage === 0;
    nextPage.disabled = currPage >= totalPages - 1;

    //add event listener to all report button
    document.querySelectorAll(".reportToBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
            let reporter = btn.getAttribute("reporter");
            let reportTo = btn.getAttribute("reportTo");
            if (!reportTo || reportTo === "null") {
                showAlert(reporter + " doesn't need to report anyone", success = true);
            }
            else {
                showAlert('"' + reporter + '"' + "must report to " + '"' + reportTo + '"', success = true);
            }
        });
    });

    //event listener to all edit buttons
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
            let id = btn.getAttribute("data-id");
            let editform = document.getElementById('add-form');
            editform.children[0].textContent = "Edit Employee";
            editform.style.display = 'flex';

            //Adding new values
            document.getElementById('employeeName').value = btn.getAttribute('name');
            document.getElementById('employeeAge').value = btn.getAttribute('age');
            if (btn.position != undefined || btn.position != "") {
                document.getElementById('position').value = btn.getAttribute('position');
            }
            document.getElementById('salary').value = btn.getAttribute('salary');
            document.getElementById('joinDate').value = btn.getAttribute('joinDate').split("T")[0];

            // remove old listener
            submitBtn.replaceWith(submitBtn.cloneNode(true));
            submitBtn = document.getElementById("submit-btn");
            submitBtn.value = "Edit Employee";
            submitBtn.addEventListener("click", () => submit(id));
        });
    });

    //event listener to add individual-delete buttons 
    document.querySelectorAll('.individual-delete').forEach(btn => {
        btn.addEventListener("click", async () => {
            let id = btn.getAttribute('data-id');

            try {
                const response = await fetch(api + `/${id}`, {
                    method: "DELETE",
                });

                if (response.status == 204) {
                    showAlert(`${btn.getAttribute('name')} Deleted!`, success = true);
                    init();
                }
                else {
                    showAlert(`Failed to delete ${btn.getAttribute('name')}, as other people report to him!`, success = false);
                }
            } catch (error) {
                showAlert("Failed: " + error.message,success=false);
            }
        })
    })
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
    addform.children[3].reset();
});

//Bulk delete
deletebtn = document.getElementById("delete-btn");
deletebtn.disable = true;
deletebtn.addEventListener("click", async () => {
    let checkboxes = document.querySelectorAll('input[name="employeeSelect"]:checked');
    if (checkboxes.length === 0) {
        showAlert("No employee is selected!", success = false)
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
            if (checkboxes.length == 1) {
                showAlert("Employee Successfully deleted!", success = true);
            }
            else {
                showAlert("Employees Successfully deleted!", success = true);
            }
            init();
        } else {
            const text = await response.text();
            if (checkboxes.length == 1) {
                const message = text ? JSON.parse(text).message : response.statusText;
                showAlert(`Failed to delete, as one of id is a reporter`, success = false);
                return;
            }
            else {
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
                        showAlert("Employees who were not referenced by other employees were Removed", success = true);
                        takenInput.style.display = 'none';
                        document.body.classList.remove('blocked');
                        init();
                    }
                    else {
                        showAlert("Failed! Some error occured!", success = false);
                        takenInput.style.display = 'none';
                        document.body.classList.remove('blocked');
                    }
                });
                document.getElementById("no").addEventListener("click", () => {
                    takenInput.style.display = 'none';
                    showAlert("Deletion canceled!", success = true);
                })
            }
        }
    } catch (error) {
        showAlert("Failed: "+"All of the selected employees can't be deleted", success = false);

    }
    document.getElementById("all").checked = false;
});


//Select all
all = document.getElementById("all");
all.addEventListener("click", () => {
    let childboxes = document.querySelectorAll(".child-boxes")
    if (all.checked) {
        childboxes.forEach(
            childbox => {
                childbox.checked = true;
            }
        )
    }
    else {
        childboxes.forEach(
            childbox => {
                childbox.checked = false;
            }
        )
    }
});


// Pagination
let prevPage = document.getElementById('prev-page');
prevPage.addEventListener("click", () => {
    if (currPage == 0) {
        prevPage.style.backgroundColor = "darkgreen";
        prevPage.disable = true;
        return;
    }
    currPage--;
    init();
});

let nextPage = document.getElementById('next-page');
nextPage.addEventListener("click", () => {
    if (currPage == totalPages - 1) {
        nextPage.disable = true;
        prevPage.style.backgroundColor = "darkgreen";
        return;
    }
    currPage++;
    init();
})


//Sorting normal
let sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener("change", () => {
    currPage = 0;
    values = sortSelect.value.split(',');
    sortBy = values[0];
    order = values[1];
    init();
})


// Sorting header
const headers = ["head-name", "head-age", "head-position", "head-salary", "head-joinDate"];
//applying event listener to all headers
headers.forEach(id => {
    const btn = document.getElementById(id);
    btn.dataset.order = "asc"; // by default It should be in asc order
    btn.addEventListener("click", () => {
        btn.dataset.order = btn.dataset.order === "asc" ? "desc" : "asc";
        sortBy = btn.value;
        order = btn.dataset.order;
        currPage = 0;
        init();
    });
});

//Searching
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


//random fulling
document.getElementById('random-btn').addEventListener("click", () => {
    document.getElementById("employeeName").value = names[Math.floor(Math.random() * (names.length - 1))];
    document.getElementById("employeeAge").value = Math.floor(Math.random() * (85 - 18) + 18);
    document.getElementById("position").value = positions[Math.floor(Math.random() * (positions.length - 1))];
    document.getElementById("salary").value = Math.floor((Math.random() * (100000 - 1000) + 1000)) + Math.ceil(Math.random() * 100) * 0.01;
    document.getElementById("joinDate").value = new Date(Math.random() * Date.now()).toISOString().split("T")[0];
})

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", addEmployeeToReport);
// when the DOM is ready, call init
// DOMContentLoaded => when HTML is parsed and DOM is built (doesn't wait for images/CSS)