// Attendance logic
let attendanceMarked = false;
let attendanceTime = "";

function markAttendance() {
  if (!attendanceMarked) {
    const currentTime = new Date().toLocaleString();
    attendanceTime = currentTime;
    attendanceMarked = true;
    alert("Attendance marked at: " + currentTime);
    document.querySelector(".attendance button").disabled = true;
    // Save attendance to DB (mocked with console log for now)
    console.log("Attendance marked at: " + currentTime);
  } else {
    alert("You have already marked attendance for today.");
  }
}

// Calendar logic (Basic Example)
function generateCalendar() {
  const calendar = document.getElementById("calendar");
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let calendarHTML = "<h4>Calendar</h4><table><tr>";

  for (let i = 1; i <= daysInMonth; i++) {
    const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let dayClass = isWeekend ? "weekend" : "";

    calendarHTML += `<td class="${dayClass}">${i}</td>`;

    if (i % 7 === 0) {
      calendarHTML += "</tr><tr>";
    }
  }

  calendarHTML += "</tr></table>";
  calendar.innerHTML = calendarHTML;
}

generateCalendar();

// Leave Request form
document.getElementById("leave-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const leaveData = {
    username: document.getElementById("username").value,
    designation: document.getElementById("designation").value,
    reason: document.getElementById("leave-reason").value
  };

  // Sending leave data to db.json (mocked with a PUT request to API)
  fetch("http://localhost:3000/leaveRequests", {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(leaveData)
  })
  .then(response => response.json())
  .then(data => {
    alert("Leave request submitted!");
  })
  .catch(error => {
    console.error("Error submitting leave request:", error);
  });
});
