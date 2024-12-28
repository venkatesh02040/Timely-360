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

    // Handle register

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const mobile = document.getElementById("registerMobile").value;
        const password = document.getElementById("registerPassword").value;
        const role = document.getElementById("registerRole").value;
        const dob = document.getElementById("registerDob").value;
        const photoInput = document.getElementById("registerPhoto");
    
        if (!name || !email || !password || !role || !dob || !photoInput.files.length) {
            alert("Please fill out all fields.");
            return;
        }
    
        const photoFile = photoInput.files[0];
        const reader = new FileReader();
    
        // Handle the photo file after it's read
        reader.onload = function (event) {
            const photoBase64 = event.target.result;
    
            // User data object
            const userData = { name, email, mobile, password, role, dob, photo: photoBase64 };
    
            // Post user data to db.json
            fetch("https://raw.githubusercontent.com/venkatesh02040/timely-json/refs/heads/main/timely-data.json", {
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
    
                    // Toggle to the login form
                    const registerForm = document.getElementById("registerForm");
                    const loginForm = document.getElementById("loginForm");
    
                    // Hide the registration form and show the login form
                    registerForm.style.display = "none";
                    loginForm.style.display = "block";
    
                    registerForm.reset();
                })
                .catch(error => {
                    alert("Error registering user. Please try again.");
                    console.error(error);
                });
        };
    
        // Read the uploaded photo as Base64
        reader.readAsDataURL(photoFile);
    });
    


    // Handle Login
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const role = document.getElementById("role").value;

        if (!email || !password || !role) {
            alert("Please fill out all fields.");
            return;
        }

        // Check if the user exists in db.json
        fetch("https://raw.githubusercontent.com/venkatesh02040/timely-json/refs/heads/main/timely-data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users.");
                }
                return response.json();
            })
            .then(users => {
                console.log(users);

                // Find the user by email and role
                const user = users.find(u => u.email === email && u.role === role);

                if (!user) {
                    alert("Invalid credentials. Please try again.");
                    return;
                }

                // Check if the password matches
                if (user.password !== password) {
                    // If it's a temporary password (mobile number), allow login even if it's not the stored password
                    if (user.mobile === password) {
                        alert("Login successful with temporary password!");
                    } else {
                        alert("Invalid credentials. Please try again.");
                        return;
                    }
                } else {
                    alert("Login successful!");
                }

                // Remove password from user data before storing it in localStorage
                delete user.password;

                // Store user details in localStorage (excluding password)
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
                console.error("Error:", error);
            });
    });


    // Handle Forgot Password
    const forgotPassword = document.getElementById("forgotPassword");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");

    forgotPassword.addEventListener("click", () => {
        const forgotPasswordModal = new bootstrap.Modal(document.getElementById("forgotPasswordModal"));
        forgotPasswordModal.show();
    });

    forgotPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("forgotName").value.trim().toLowerCase();
        const dob = document.getElementById("forgotDob").value;

        if (!name || !dob) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch("https://raw.githubusercontent.com/venkatesh02040/timely-json/refs/heads/main/timely-data.json");
            if (!response.ok) {
                throw new Error("Failed to fetch users.");
            }

            const users = await response.json();
            console.log("Users fetched:", users);

            // Find the user by name and date of birth
            const user = users.find(u => u.name.toLowerCase() === name && u.dob === dob);

            if (!user) {
                alert("No user found with the given details.");
                return;
            }

            // Temporary password is the user's mobile number
            const tempPassword = user.mobile; // Assuming the mobile number is stored in 'mobile'

            alert(`Your temporary password is set for login`);

            // Autofill the login form with the user's email and mobile number as the temporary password
            document.getElementById("loginEmail").value = user.email;
            document.getElementById("loginPassword").value = tempPassword;

            // Hide the forgot password modal
            const forgotPasswordModal = bootstrap.Modal.getInstance(document.getElementById("forgotPasswordModal"));
            forgotPasswordModal.hide();
        } catch (error) {
            alert("Error processing request. Please try again.");
            console.error("Error:", error);
        }
    });




});


