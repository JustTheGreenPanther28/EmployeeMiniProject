let employees = [];
let api = "http://localhost:8080/employee";
let totalPages = 0;
let currPage = 0;
let sortBy = "employeeName";
let order = "asc"
async function fetchEmployees(page, size, sortBy, order) {
    try {
        let response = await fetch(api + `?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`);
        if (response.ok) {
            let data = await response.json();
            employees = data.content;
            totalPages = data.totalPages;
        } else {
            const error = await response.json();
            showAlert("Error Occured, Unable fetch the data");
        }
    } catch (error) {
        showAlert("Error Occured, Unable fetch the data");
    }
    return employees;
}

async function init() {
    let employeeValues = await fetchEmployees(currPage, 10,sortBy,order);
    let currentPage = document.getElementById("curr-page");
    currentPage.textContent = `Page ${currPage + 1} of ${totalPages}`;
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
            <td><button class="reportToBtn" data-id="${employee.employeeId}">Report To</button></td>
        </tr>`;
        tb.insertAdjacentHTML("beforeend", newRow);
    }

    prevPage.disabled = currPage === 0;
    nextPage.disabled = currPage >= totalPages - 1;

    document.querySelectorAll(".reportToBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
            let id = btn.getAttribute("data-id");
            const response = await fetch(api + `/report/${id}`);
            if (response.ok) {
                let data = await response.json();
                if (data == undefined || data.length == 0) {
                    showAlert("No employees found!")
                }

                showAlert("Id and name of employee to report:\n" + "Id : " + (data[0].id) + " Name: " + (data[0].name), "#0f5132", "#d1e7dd", "#badbcc");
            }
            else {
                const error = await response.json();
                showAlert("Error occured while fetching records")
            }
        });
    });
}

document.getElementById("add-btn").addEventListener("click", () => {
    let addform = document.getElementById('add-form');
    addform.style.display = 'flex';
});

document.getElementById('cross').addEventListener("click", () => {
    let addform = document.getElementById('add-form');
    addform.style.display = 'none';

})

deletebtn = document.getElementById("delete-btn");
deletebtn.disable = true;
deletebtn.addEventListener("click", async () => {
    let checkboxes = document.querySelectorAll('input[name="employeeSelect"]:checked');
    if (checkboxes.length === 0) {
        showAlert("No employee is selected!")
        return;
    }

    let ids = Array.from(checkboxes).map(checkbox => checkbox.value);

    for (let id of ids) {
        const response = await fetch(api + `/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            document.querySelector(`input[value="${id}"]`).closest("tr").remove();
        } else {
            const text = await response.text();
            const message = text ? JSON.parse(text).message : response.statusText;
            showAlert(`Failed to delete ${id}: ` + message);
        }
    }
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

//alert showing
function showAlert(message, color = "#842029", background = "#f8d7da", border = "#f1aeb5") {
    alert = document.getElementById("alert");
    msg = document.getElementById("alert-message");
    table = document.getElementsByClassName('table-wrap')[0];
    alert.style.backgroundColor = background;
    alert.style.borderColor = border;
    alert.style.display = "flex";
    msg.style.color = color;
    table.style.marginTop = "50px";
    document.body.classList.add("blocked");
    msg.append(" " + message);

    setTimeout(() => {
        alert.style.display = "none";
        msg.textContent = "";
        table.style.marginTop = "20px";
        document.body.classList.remove("blocked");
    }, 2000);
}

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
sortSelect.addEventListener("change",() => {
    currPage=0;
    values = sortSelect.value.split(',');
    sortBy=values[0];
    order=values[1];
    init();
})

document.addEventListener("DOMContentLoaded", init);
// when the DOM is ready, call init
// DOMContentLoaded => when HTML is parsed and DOM is built (doesn't wait for images/CSS)