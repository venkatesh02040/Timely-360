// Initialize variables
let attendanceMarked = false;

// Utility function to get current time in IST
function getIndianTimestamp() {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istDate = new Date(now.getTime() + offset);
  return istDate.toISOString().replace("T", " ").slice(0, 19); // Format: YYYY-MM-DD HH:MM:SS
}

// Function to check if attendance is already marked
function checkAttendanceStatus() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser || !loggedInUser.id) {
    console.error("No user data found or user ID is missing.");
    alert("You need to log in first.");
    return;
  }

  return fetch(`https://timely-360.onrender.com/attendance?id=${loggedInUser.id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data.");
      }
      return response.json();
    })
    .then(attendanceRecords => {
      // Check if attendance is marked for today
      const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
      const attendanceToday = attendanceRecords.some(record => record.markedAt.startsWith(today));

      if (attendanceToday) {
        attendanceMarked = true;
        const attendanceButton = document.querySelector("#mark-attendance-btn");
        if (attendanceButton) {
          attendanceButton.disabled = true; // Disable the button
          alert("Your attendance for today is already marked.");
        }
      }
    })
    .catch(error => {
      console.error("Error checking attendance status:", error);
    });
}

// Function to get the logged-in user from the JSON server
function getUserDataFromServer(username) {
  return fetch(`https://timely-360.onrender.com/users?name=${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }
      return response.json();
    })
    .then(users => {
      if (users.length === 0) {
        console.error("User not found.");
        alert("User not found.");
        return null;
      }
      return users[0]; // Return the user that matches the username
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
      alert("An error occurred while fetching user data.");
      return null;
    });
}

// Define the markAttendance function
function markAttendance() {

  if (attendanceMarked) {
    alert("You have already marked attendance for today.");
    return;
  }

  // Retrieve the logged-in user object from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser || !loggedInUser.name) {
    console.error("No user data found or name is missing.");
    alert("You need to log in first.");
    return;
  }

  const username = loggedInUser.name;

  getUserDataFromServer(username).then(user => {
    if (!user) return; // If no user is found, exit

    const { name: fullName, id: userId } = user;
    const currentTime = getIndianTimestamp();

    // Prepare the attendance data
    const attendanceData = {
      username: fullName,
      id: userId,
      markedAt: currentTime
    };

    // Send the attendance data to the server
    fetch("https://timely-360.onrender.com/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(attendanceData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to mark attendance.");
        }
        return response.json();
      })
      .then(data => {
        attendanceMarked = true;
        alert("Attendance marked at: " + currentTime);
        const attendanceButton = document.querySelector("#mark-attendance-btn");
        if (attendanceButton) {
          attendanceButton.disabled = true; // Disable the button
        }
        (data);
      })
      .catch(error => {
        console.error("Error marking attendance:", error);
        alert("An error occurred while marking attendance. Please try again.");
      });
  });
}

// Attach event listener after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const attendanceButton = document.querySelector("#mark-attendance-btn");
  if (attendanceButton) {
    attendanceButton.addEventListener("click", markAttendance);
  } else {
    console.error("Attendance button not found in the DOM.");
  }

  // Check attendance status on page load
  checkAttendanceStatus();
});

// Calendar logic
const currentDate = dayjs();
let selectedDate = currentDate;

const monthYearLabel = document.getElementById("currentMonthYear");
const prevButton = document.getElementById("prevMonth");
const nextButton = document.getElementById("nextMonth");
const calendarDays = document.getElementById("calendarDays");

let holidays = []; // Store fetched holidays

// Fetch holidays from JSON Server
function fetchHolidays() {
  fetch("https://timely-360.onrender.com/holidays")
    .then(response => response.json())
    .then(data => {
      holidays = data; // Store holidays in the variable
      updateCalendar(selectedDate); // Refresh calendar with holidays
    })
    .catch(error => console.error("Error fetching holidays:", error));
}

// Update Calendar
function updateCalendar(date) {
  monthYearLabel.textContent = date.format("MMMM YYYY");
  calendarDays.innerHTML = "";

  const startOfMonth = date.startOf("month");
  const endOfMonth = date.endOf("month");
  const startDay = startOfMonth.day();
  const totalDays = endOfMonth.date();

  let row = document.createElement("tr");

  for (let i = 0; i < startDay; i++) {
    const blankCell = document.createElement("td");
    row.appendChild(blankCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement("td");
    const fullDate = date.date(day).format("YYYY-MM-DD");

    const dayOfWeek = date.date(day).day();
    if (dayOfWeek === 0) dayCell.classList.add("sunday");
    if (dayOfWeek === 6 && day >= 8 && day <= 14) dayCell.classList.add("second-saturday");
    if (dayOfWeek === 6 && day >= 22 && day <= 28) dayCell.classList.add("fourth-saturday");

    const holiday = holidays.find(h => h.date === fullDate);
    if (holiday) {
      dayCell.classList.add(holiday.type === "public" ? "bg-success" : "bg-info");
      dayCell.setAttribute("title", `${holiday.name}: ${holiday.description}`);
      dayCell.addEventListener("click", () => showHolidayModal(holiday));
    }

    if (date.date(day).isSame(currentDate, "day")) {
      dayCell.classList.add("current-day");
    }

    dayCell.textContent = day;
    row.appendChild(dayCell);

    if ((startDay + day) % 7 === 0) {
      calendarDays.appendChild(row);
      row = document.createElement("tr");
    }
  }

  if (row.children.length > 0) {
    calendarDays.appendChild(row);
  }
}

// Show holiday details in a modal
function showHolidayModal(holiday) {
  document.getElementById("holidayTitle").textContent = holiday.name;
  document.getElementById("holidayDescription").textContent = holiday.description;

  const myModal = new bootstrap.Modal(document.getElementById("holidayModal"));
  myModal.show();
}

// Event listeners for navigation buttons
prevButton.addEventListener("click", () => {
  selectedDate = selectedDate.subtract(1, "month");
  updateCalendar(selectedDate);
});

nextButton.addEventListener("click", () => {
  selectedDate = selectedDate.add(1, "month");
  updateCalendar(selectedDate);
});

// Fetch holidays and initialize calendar
fetchHolidays();


// Handle the "Select Leave Date" button click

// Restrict date picker to prevent selecting past dates
document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("leave-date-picker");

  function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const minDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    dateInput.setAttribute("min", minDate);
  }

  setMinDate(); // Set min date on page load

  // Leave Request form submission
  document.getElementById("leave-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    function getIndianTimestamp() {
      const now = new Date();
      const offset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(now.getTime() + offset);
      return istDate.toISOString().replace("T", " ").slice(0, 19);
    }

    if (!selectedLeaveDate) {
      alert("Please select a leave date before submitting.");
      return;
    }

    const leaveData = {
      username: document.getElementById("username").value.trim(),
      designation: document.getElementById("designation").value.trim(),
      reason: document.getElementById("reason").value.trim(),
      leaveDate: selectedLeaveDate,
      status: "Pending",
      submittedAt: getIndianTimestamp()
    };

    if (!leaveData.username || !leaveData.designation || !leaveData.reason) {
      alert("All fields are required. Please fill in all details.");
      return;
    }

    fetch("https://timely-360.onrender.com/leaveRequests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leaveData)
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to submit leave request");
        return response.json();
      })
      .then(data => {
        alert("Leave request submitted successfully!");
        document.getElementById("leave-form").reset();
        document.getElementById("selected-leave-date").textContent = "Leave Date: None";
        selectedLeaveDate = null;

        // **Automatically refresh leave status after submission**
        displayLeaveRequestStatus();
      })
      .catch(error => {
        console.error("Error submitting leave request:", error);
        alert("There was an error submitting your leave request. Please try again.");
      });
  });

  let selectedLeaveDate = null;

  document.getElementById("select-leave-date-btn").addEventListener("click", (event) => {
    event.preventDefault();
    dateInput.style.visibility = "visible";
    dateInput.style.position = "static";
    dateInput.focus();
    dateInput.addEventListener("blur", () => {
      dateInput.style.visibility = "hidden";
      dateInput.style.position = "absolute";
    }, { once: true });
  });

  dateInput.addEventListener("change", (event) => {
    selectedLeaveDate = event.target.value;
    document.getElementById("selected-leave-date").textContent = `Leave Date: ${selectedLeaveDate}`;
  });
});

// Function to display leave request status
function displayLeaveRequestStatus() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser || !loggedInUser.name) {
    console.error("No user data found or name is missing.");
    alert("You need to log in first.");
    return;
  }

  const username = loggedInUser.name;

  getUserDataFromServer(username).then(user => {
    if (!user) return; // If no user is found, exit

    const { name: fullName, id: userId } = user;

    fetch("https://timely-360.onrender.com/leaveRequests")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch leave requests.");
        }
        return response.json();
      })
      .then(data => {
        const userLeaves = data.filter(req => req.username === fullName);

        const leaveStatusBody = document.querySelector("#leave-status-body");

        if (!leaveStatusBody) {
          console.error("Leave status body not found in the DOM.");
          return;
        }

        leaveStatusBody.innerHTML = ""; // Clear previous content

        if (userLeaves.length === 0) {
          leaveStatusBody.innerHTML = "<tr><td colspan='3'>No leave requests found.</td></tr>";
          return;
        }

        userLeaves.forEach(req => {
          let row = `
            <tr>
              <td>${req.leaveDate}</td>
              <td>${req.reason}</td>
              <td class="${req.status === 'Approved' ? 'approved' : 'pending'}">${req.status}</td>
            </tr>
          `;
          leaveStatusBody.innerHTML += row;
        });
      })
      .catch(error => {
        console.error("Error fetching leave requests:", error);
        alert("An error occurred while fetching leave requests. Please try again.");
      });
  });
}

// **Ensure the leave status is loaded on page load**
displayLeaveRequestStatus();

//logoutButton

document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});
