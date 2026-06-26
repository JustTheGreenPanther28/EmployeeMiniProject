let employees = [];
const api = "http://localhost:1010/api/v1/employee";
let size = 5;
let totalPages = 0;
let currPage = 0;
let sortBy = "employeeName";
let order = "asc";
let submitBtn = document.getElementById("submit-btn");

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
        })
    })
}

document.getElementById("add-btn").addEventListener("click", () => {
    let addform = document.getElementById('add-form');
    addform.children[0].textContent = "Employee Details";
    addform.style.display = 'flex';

    submitBtn.replaceWith(submitBtn.cloneNode(true));
    submitBtn = document.getElementById("submit-btn");
    submitBtn.value = "Add Employee";
    submitBtn.addEventListener("click", () => submit());
});

document.getElementById('cross').addEventListener("click", () => {
    let addform = document.getElementById('add-form');
    addform.style.display = 'none';
    addform.children[2].reset();
})

deletebtn = document.getElementById("delete-btn");
deletebtn.disable = true;
deletebtn.addEventListener("click", async () => {
    let checkboxes = document.querySelectorAll('input[name="employeeSelect"]:checked');
    if (checkboxes.length === 0) {
        showAlert("No employee is selected!", success = false)
        return;
    }

    let ids = Array.from(checkboxes).map(checkbox => checkbox.value);

    const response = await fetch(api + '/ids', {
        method: "DELETE",
        body: JSON.stringify(ids),
        headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
        init();
    } else {
        const text = await response.text();
        const message = text ? JSON.parse(text).message : response.statusText;
        showAlert(`Failed to delete, as one of id is a reporter`, success = false);
        return;
    }
    document.getElementById("all").checked = false;
});
// select all check boxs
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

//Pagination
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

//sorting
let sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener("change", () => {
    currPage = 0;
    values = sortSelect.value.split(',');
    sortBy = values[0];
    order = values[1];
    init();
})

//sorting through heading name

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


// employee report to in additon of employee
async function addEmployeeToReport() {

    const response = await fetch(api + "/report", {
        method: "GET"
    })

    if (response.ok) {

        let data = response.json();

        let countAndName = data.content;

        if (countAndName == undefined || countAndName == null || countAndName == "") {
            return;
        }
        let reportTo = document.getElementById('report-to');
        reportTo.innerHTML = `<option value="" id="none">-- None --</option>`;
        for (let employee of employees) {
            //   ---------------This is Text----------------    -------value---------
            let newOption = new Option(`${employee.employeeName}  (${employee.count})`, `${employee.employeeId}`);
            reportTo.add(newOption);
        }
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
    if (!isNaN(employeeName) || employeeName == "" || employeeName.length === 0) {
        showAlert("Please enter a valid name!", success = false);
        return;
    }
    if (employeeAge == undefined || employeeAge == "" || isNaN(employeeAge) || employeeAge < 18 || employeeAge >= 100) {
        showAlert("Please enter a valid age (must be 18 or older).", success = false);
        return;
    }

    if (salary == "" || salary == undefined || parseFloat(salary) < 0) {
        showAlert("Please enter a valid salary!", success = false);
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
            addEmployeeToReport(employeeValues);
            init();
            document.getElementById('add-form-form').reset();
            document.getElementById('add-form').style.display = 'none';
            submitBtn.disable = false;
            return;
        } else {
            const error = await response.json();
            showAlert("Failed: " + error.message, success = false);
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
            showAlert("Failed: " + error.message, success = false);
            return;
        }
    }
    addEmployeeToReport(employeeValues);
}

function showAlert(message, success) {
    let color, background, border;
    if (!success) {
        color = "#842029"; background = "#f8d7da"; border = "#f1aeb5";
    }
    else {
        color = "#0f5132"; background = "#d1e7dd"; border = "#badbcc";
    }
    alert = document.getElementById("alert");
    msg = document.getElementById("alert-message");
    alert.style.backgroundColor = background;
    alert.style.borderColor = border;
    alert.style.display = "flex";
    msg.style.color = color;
    document.body.classList.add("blocked");
    msg.textContent = "";
    msg.append(" " + message);

    setTimeout(() => {
        alert.style.display = "none";
        msg.textContent = "";
        document.body.classList.remove("blocked");
    }, 3000);
}

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

async function searchEmployees(query) {
    try {
        const response = await fetch(api + `/search?query=${encodeURIComponent(query)}&page=0&size=10`);
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

document.addEventListener("DOMContentLoaded", init);
// when the DOM is ready, call init
// DOMContentLoaded => when HTML is parsed and DOM is built (doesn't wait for images/CSS)