// document.addEventListener('DOMContentLoaded', function () {
//     fetchEmployees();
//     fetchLeaveRequests();
// });

// // Fetch employee data
// function fetchEmployees() {
//     fetch('http://localhost:3000/users')
//         .then(response => response.json())
//         .then(users => {
//             let employeeTable = document.getElementById('employeeList');
//             employeeTable.innerHTML = '';

//             users.forEach(user => {
//                 let row = `<tr>
//                     <td>${user.name}</td>
//                     <td>${user.email}</td>
//                     <td>${user.role}</td>
//                     <td>
//                         <button class="btn btn-warning" onclick="editEmployee(${user.id})">Edit</button>
//                         <button class="btn btn-danger" onclick="deleteEmployee(${user.id})">Delete</button>
//                     </td>
//                 </tr>`;
//                 employeeTable.innerHTML += row;
//             });
//         });
// }

// // Fetch leave requests
// function fetchLeaveRequests() {
//     fetch('http://localhost:3000/leaves')
//         .then(response => response.json())
//         .then(leaves => {
//             let leaveTable = document.getElementById('leaveList');
//             leaveTable.innerHTML = '';

//             leaves.forEach(leave => {
//                 let row = `<tr>
//                     <td>${leave.userId}</td>
//                     <td>${leave.type}</td>
//                     <td>${leave.status}</td>
//                     <td>
//                         <button class="btn btn-success" onclick="approveLeave(${leave.id})">Approve</button>
//                         <button class="btn btn-danger" onclick="rejectLeave(${leave.id})">Reject</button>
//                     </td>
//                 </tr>`;
//                 leaveTable.innerHTML += row;
//             });
//         });
// }

// // Approve leave
// function approveLeave(id) {
//     fetch(`http://localhost:3000/leaves/${id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status: 'approved' }),
//         headers: { 'Content-Type': 'application/json' }
//     })
//         .then(response => response.json())
//         .then(() => fetchLeaveRequests());
// }

// // Reject leave
// function rejectLeave(id) {
//     fetch(`http://localhost:3000/leaves/${id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status: 'rejected' }),
//         headers: { 'Content-Type': 'application/json' }
//     })
//         .then(response => response.json())
//         .then(() => fetchLeaveRequests());
// }

// // Edit employee
// function editEmployee(id) {
//     fetch(`http://localhost:3000/users/${id}`)
//         .then(response => response.json())
//         .then(user => {
//             // Logic to populate an edit form (to be implemented)
//             console.log('Editing user:', user);
//         });
// }

// // Delete employee
// function deleteEmployee(id) {
//     fetch(`http://localhost:3000/users/${id}`, {
//         method: 'DELETE'
//     })
//         .then(() => fetchEmployees());
// }

// // Add new employee (Placeholder function)
// function openAddEmployeeForm() {
//     // Function to open the Add Employee Modal
//     function openAddEmployeeForm() {
//         const modal = new bootstrap.Modal(document.getElementById('addEmployeeModal'));
//         modal.show();
//     }
// }




