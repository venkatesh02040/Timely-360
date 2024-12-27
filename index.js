document.addEventListener("DOMContentLoaded", function () {
    const currentDate = dayjs();
    let selectedDate = currentDate;

    const monthYearLabel = document.getElementById("currentMonthYear");
    const prevButton = document.getElementById("prevMonth");
    const nextButton = document.getElementById("nextMonth");
    const calendarDays = document.getElementById("calendarDays");

    // Mock Data: Holidays
    const holidays = [
        { date: "2024-01-01", type: "public", name: "New Year's Day", description: "Celebration of the New Year." },
        { date: "2024-01-26", type: "public", name: "Republic Day", description: "Commemoration of the Indian Republic." },
        { date: "2024-10-31", type: "festival", name: "Diwali", description: "Festival of Lights celebrated across India." },
        { date: "2025-01-01", type: "public", name: "New Year's Day", description: "Celebration of the New Year." }
    ];

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
                dayCell.addEventListener("click", () => {
                    const holidayDetails = document.getElementById("holidayDetails");
                    holidayDetails.textContent = `${holiday.name}: ${holiday.description}`;
                    const myModal = new bootstrap.Modal(document.getElementById('holidayModal'));
                    myModal.show();
                });
            }

            if (date.date(day).isSame(currentDate, 'day')) {
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

    prevButton.addEventListener("click", () => {
        selectedDate = selectedDate.subtract(1, "month");
        updateCalendar(selectedDate);
    });

    nextButton.addEventListener("click", () => {
        selectedDate = selectedDate.add(1, "month");
        updateCalendar(selectedDate);
    });

    updateCalendar(currentDate);

    // Register Form Validation and POST to db.json
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const mobile = document.getElementById("registerMobile").value;
        const password = document.getElementById("registerPassword").value;
        const role = document.getElementById("registerRole").value;
        const dob = document.getElementById("registerDob").value;

        if (!name || !email || !password || !role || !dob) {
            alert("Please fill out all fields.");
            return;
        }

        // User data object
        const userData = { name, email, mobile, password, role, dob };

        // Post user data to db.json
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to register user.");
                }
                return response.json();
            })
            .then(() => {
                alert("Registration successful!");
                registerForm.reset();
            })
            .catch(error => {
                alert("Error registering user. Please try again.");
                console.error(error);
            });
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const role = document.getElementById("role").value;

        if (!email || !password || !role) {
            alert("Please fill out all fields.");
            return;
        }

        // Check if user exists in db.json
        fetch("http://localhost:3000/users")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users.");
                }
                return response.json();
            })
            .then(users => {
                console.log(users);  
                
                // Log the users to check the data
                const user = users.find(u => u.email === email && u.role === role);

                // let fd = users.filter(i => { return i.email == email })
                // let user = fd[0]


                if (!user) {
                    console.log("No user found with the given email and role");
                    alert("Invalid credentials. Please try again.");
                    return;
                }

                if (user.password != password) {
                    console.log("Password doesn't match");
                    alert("Invalid credentials. Please try again.");
                    return;
                }

                alert("login success")


                delete user.password
                // // Store user details in localStorage (excluding password)
                localStorage.setItem("loggedInUser", JSON.stringify(user));

                // Welcome message
                alert(`Welcome, ${user.name}!`);

                // Redirect based on role
                if (role === "employee") {
                    window.location.href = "employee.html";
                } else if (role === "admin") {
                    window.location.href = "admin.html";
                }
            })
            .catch(error => {
                alert("Error logging in. Please try again.");
                console.error(error);
            });
    });



});
