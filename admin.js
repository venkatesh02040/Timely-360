// Function to filter employees based on search input
function searchEmployees() {
    let input = document.getElementById("employeeSearch").value.toLowerCase();
    let table = document.getElementById("employeeTableContainer");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        let text = rows[i].innerText.toLowerCase();
        rows[i].style.display = text.includes(input) ? "" : "none";
    }
}

// Function to filter holidays based on search input
function searchHolidays() {
    let input = document.getElementById("holidaySearch").value.toLowerCase();
    let table = document.getElementById("holidayList");
    let rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let text = rows[i].innerText.toLowerCase();
        rows[i].style.display = text.includes(input) ? "" : "none";
    }
}


function fetchEmployees() {
    const tableContainer = document.getElementById('employeeTableContainer'); // This is the container where the table will be appended
    let employeeTable = document.getElementById('employeeList');

    // Create table element if it doesn't exist
    if (!employeeTable) {
        employeeTable = document.createElement('table');
        employeeTable.id = 'employeeList';
        employeeTable.classList.add('table', 'table-striped');

        // Create thead with column names
        const thead = document.createElement('thead');
        thead.innerHTML = `
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    `;

        // Create tbody (the part where we will populate employee data)
        const tbody = document.createElement('tbody');
        employeeTable.appendChild(thead);
        employeeTable.appendChild(tbody);

        // Append the table to the container
        tableContainer.appendChild(employeeTable);
    }

    // Fetch employee data from the backend
    fetch('https://timely-360.onrender.com/users')
        .then(response => response.json())
        .then(employees => {
            // Clear previous content
            const tbody = employeeTable.getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';

            // Loop through employees and create rows
            employees.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                <td>${employee.name}</td>
                                <td>${employee.email}</td>
                                <td>${employee.role}</td>
                                <td>
                                    <button class="btn btn-warning" onclick="editEmployee('${employee.id}')">Edit</button>
                                    <button class="btn btn-danger" onclick="deleteEmployee('${employee.id}')">Delete</button>
                                </td>
                            `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching employees:', error));
}

// Call fetchEmployees on page load
fetchEmployees();

document.addEventListener('DOMContentLoaded', function () {
    // Fetch Employees from Backend
    function fetchEmployees() {
        const tableContainer = document.getElementById('employeeTableContainer'); // This is the container where the table will be appended
        let employeeTable = document.getElementById('employeeList');

        // Create table element if it doesn't exist
        if (!employeeTable) {
            employeeTable = document.createElement('table');
            employeeTable.id = 'employeeList';
            employeeTable.classList.add('table', 'table-striped');

            // Create thead with column names
            const thead = document.createElement('thead');
            thead.innerHTML = `
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    `;

            // Create tbody (the part where we will populate employee data)
            const tbody = document.createElement('tbody');
            employeeTable.appendChild(thead);
            employeeTable.appendChild(tbody);

            // Append the table to the container
            tableContainer.appendChild(employeeTable);
        }

        // Fetch employee data from the backend
        fetch('https://timely-360.onrender.com/users')
            .then(response => response.json())
            .then(employees => {
                // Clear previous content
                const tbody = employeeTable.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';

                // Loop through employees and create rows
                employees.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                                <td>${employee.name}</td>
                                <td>${employee.email}</td>
                                <td>${employee.role}</td>
                                <td>
                                    <button class="btn btn-warning" onclick="editEmployee('${employee.id}')">Edit</button>
                                    <button class="btn btn-danger" onclick="deleteEmployee('${employee.id}')">Delete</button>
                                </td>
                            `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching employees:', error));
    }

    // Call fetchEmployees on page load
    fetchEmployees();

    // Add Employee Functionality
    document.getElementById('addEmployeeForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const newEmployee = {
            name: document.getElementById('addEmployeeName').value,
            email: document.getElementById('addEmployeeEmail').value,
            mobile: document.getElementById('addEmployeeMobile').value,
            password: document.getElementById('addEmployeePassword').value,
            role: document.getElementById('addEmployeeRole').value,
            dob: document.getElementById('addEmployeeDob').value,
            photo: document.getElementById('addEmployeePhoto').value // Assuming base64 encoding for photo
        };

        fetch('https://timely-360.onrender.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add employee');
                }
                return response.json();
            })
            .then(() => {
                alert('Employee added successfully!');
                fetchEmployees(); // Refresh the employee list
                const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
                modal.hide(); // Close the modal after submission
            })
            .catch(error => console.error('Error adding employee:', error));
    });
});

// Edit Employee Function
function editEmployee(id) {
    fetch(`https://timely-360.onrender.com/users/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch employee data");
            }
            return response.json();
        })
        .then((employee) => {
            document.getElementById("editEmployeeName").value = employee.name;
            document.getElementById("editEmployeeEmail").value = employee.email;
            document.getElementById("editEmployeeRole").value = employee.role;
            document.getElementById("editEmployeeMobile").value = employee.mobile;
            document.getElementById("editEmployeePassword").value = employee.password;
            document.getElementById("editEmployeeDob").value = employee.dob;

            // Preserve the current photo URL
            let existingPhotoUrl = employee.photo;

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById("editEmployeeModal"));
            modal.show();

            // Update the form submission handler to save changes
            document.getElementById("editEmployeeForm").onsubmit = async function (event) {
                event.preventDefault();

                // Handle image upload
                const photoInput = document.getElementById("editEmployeePhoto");
                let updatedPhotoUrl = existingPhotoUrl; // Default to existing photo

                if (photoInput && photoInput.files.length > 0) {
                    const file = photoInput.files[0];
                    updatedPhotoUrl = await convertToBase64(file); // Convert image to Base64
                }

                // Construct the updated employee object
                const updatedEmployee = {
                    name: document.getElementById("editEmployeeName").value,
                    email: document.getElementById("editEmployeeEmail").value,
                    role: document.getElementById("editEmployeeRole").value,
                    mobile: document.getElementById("editEmployeeMobile").value,
                    password: document.getElementById('editEmployeePassword').value,
                    dob: document.getElementById("editEmployeeDob").value,
                    photo: updatedPhotoUrl, // Updated or existing photo URL
                };

                fetch(`https://timely-360.onrender.com/users/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedEmployee),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to update employee");
                        }
                        return response.json();
                    })
                    .then(() => {
                        alert("Employee updated successfully!");
                        fetchEmployees(); // Refresh the employee list
                        modal.hide();
                    })
                    .catch((error) => console.error("Error updating employee:", error));
            };
        })
        .catch((error) => console.error("Error fetching employee data:", error));
}

// Convert image file to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}


// Delete Employee Function
function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        fetch(`https://timely-360.onrender.com/users/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    alert('Employee deleted successfully!');
                    fetchEmployees(); // Refresh the employee list
                } else {
                    throw new Error('Failed to delete employee');
                }
            })
            .catch(error => console.error('Error deleting employee:', error));
    }
}

// Employee attendance 

fetch("https://timely-360.onrender.com/attendance")
    .then(response => response.json())
    .then(data => {
        const attendanceTable = document.getElementById("attendanceTableBody");
        attendanceTable.innerHTML = ''; // Clear previous data
        data.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.username}</td>
                <td>${new Date(record.markedAt).toLocaleString()}</td>
            `;
            attendanceTable.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching attendance data:", error);
    });


// Fetch and display leave requests
function fetchLeaveRequests() {
    fetch("https://timely-360.onrender.com/leaveRequests")
        .then(response => response.json())
        .then(data => {
            const leaveTableBody = document.getElementById("leaveTableBody");
            leaveTableBody.innerHTML = ''; // Clear previous data

            data.forEach(request => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${request.username}</td> <!-- Corrected from employeeName -->
                    <td>${request.reason}</td> <!-- Corrected from leaveType -->
                    <td>${new Date(request.leaveDate).toLocaleDateString()}</td> <!-- Corrected from date -->
                    <td>${request.status}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="approveLeave(${request.id})">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectLeave(${request.id})">Reject</button>
                    </td>
                `;
                leaveTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching leave requests:", error);
        });
}

// Approve leave request
function approveLeave(id) {
    updateLeaveStatus(id, "Approved");
}

// Reject leave request
function rejectLeave(id) {
    updateLeaveStatus(id, "Rejected");
}

// Update leave request status
function updateLeaveStatus(id, status) {
    fetch(`https://timely-360.onrender.com/leaveRequests/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update leave status");
            }
            return response.json();
        })
        .then(() => {
            alert(`Leave request ${status.toLowerCase()} successfully!`);
            fetchLeaveRequests(); // Refresh the leave requests table
        })
        .catch(error => {
            console.error(`Error updating leave request status:`, error);
            alert("Failed to update leave status. Please try again.");
        });
}

// Initialize leave requests on page load
document.addEventListener("DOMContentLoaded", fetchLeaveRequests);

// Fetch and display holidays
function fetchHolidays() {
    fetch("https://timely-360.onrender.com/holidays")
        .then((response) => response.json())
        .then((data) => {
            const holidayList = document.getElementById("holidayList");
            holidayList.innerHTML = ""; // Clear previous data

            data.forEach((holiday) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${new Date(holiday.date).toLocaleDateString()}</td>
                    <td>${holiday.name}</td>
                    <td>${holiday.description}</td>
                    <td>
                        <button class="btn btn-warning edit-button" data-id="${holiday.id}">Edit</button>
                        <button class="btn btn-danger delete-button" data-id="${holiday.id}">Delete</button>
                    </td>
                `;
                holidayList.appendChild(row);
            });

            // Attach event listeners to dynamically added buttons
            attachEventListeners();
        })
        .catch((error) => {
            console.error("Error fetching holidays:", error);
        });
}

// Attach event listeners to Edit and Delete buttons
function attachEventListeners() {
    const editButtons = document.querySelectorAll(".edit-button");
    const deleteButtons = document.querySelectorAll(".delete-button");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const holidayId = button.getAttribute("data-id");
            openEditHolidayForm(holidayId);
        });
    });

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const holidayId = button.getAttribute("data-id");
            confirmDeleteHoliday(holidayId);
        });
    });
}

// Function to confirm before deleting holiday
function confirmDeleteHoliday(id) {
    if (confirm("Are you sure you want to delete this holiday?")) {
        deleteHoliday(id);
    }
}

// Add Holiday Form Submission
function openAddHolidayForm() {
    const modalElement = document.getElementById("addHolidayModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    const form = document.getElementById("addHolidayForm");
    form.reset();

    form.onsubmit = function (event) {
        event.preventDefault();

        const holiday = {
            date: document.getElementById("addHolidayDate").value,
            name: document.getElementById("addHolidayName").value,
            description: document.getElementById("addHolidayDescription").value,
            type: document.getElementById("addHolidayType").value, // Get selected holiday type
        };

        if (!holiday.date || !holiday.name || !holiday.description || !holiday.type) {
            alert("All fields are required. Please fill in all details.");
            return;
        }

        fetch("https://timely-360.onrender.com/holidays", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(holiday),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add holiday");
                }
                return response.json();
            })
            .then(() => {
                alert("Holiday added successfully!");
                fetchHolidays(); // Refresh the calendar
                modal.hide(); // Close the modal
            })
            .catch((error) => {
                console.error("Error adding holiday:", error);
            });
    };
}

openAddHolidayForm()

// Open the Edit Holiday Modal
function openEditHolidayForm(id) {
    fetch(`https://timely-360.onrender.com/holidays/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch holiday");
            }
            return response.json();
        })
        .then((holiday) => {
            document.getElementById("editHolidayDate").value = holiday.date;
            document.getElementById("editHolidayName").value = holiday.name;
            document.getElementById("editHolidayDescription").value = holiday.description;
            document.getElementById("editHolidayType").value = holiday.type; // Set correct holiday type

            const modal = new bootstrap.Modal(document.getElementById("editHolidayModal"));
            modal.show();

            const form = document.getElementById("editHolidayForm");
            form.onsubmit = function (event) {
                event.preventDefault();

                const updatedHoliday = {
                    date: document.getElementById("editHolidayDate").value,
                    name: document.getElementById("editHolidayName").value,
                    description: document.getElementById("editHolidayDescription").value,
                    type: document.getElementById("editHolidayType").value, // Get selected type
                };

                if (!updatedHoliday.date || !updatedHoliday.name || !updatedHoliday.description || !updatedHoliday.type) {
                    alert("All fields are required. Please fill in all details.");
                    return;
                }

                fetch(`https://timely-360.onrender.com/holidays/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedHoliday),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to update holiday");
                        }
                        return response.json();
                    })
                    .then(() => {
                        alert("Holiday updated successfully!");
                        fetchHolidays(); // Refresh the list
                        modal.hide(); // Close the modal
                    })
                    .catch((error) => {
                        console.error("Error updating holiday:", error);
                    });
            };
        })
        .catch((error) => {
            console.error("Error fetching holiday:", error);
        });
}

// Delete holiday
function deleteHoliday(id) {
    if (!id) {
        console.error("Holiday ID is missing");
        return;
    }

    fetch(`https://timely-360.onrender.com/holidays/${id}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete holiday");
            }
            alert("Holiday deleted successfully!");
            fetchHolidays(); // Refresh the holiday list
        })
        .catch((error) => {
            console.error("Error deleting holiday:", error);
        });
}

// Initialize holidays on page load
document.addEventListener("DOMContentLoaded", fetchHolidays);

//logoutButton

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});
