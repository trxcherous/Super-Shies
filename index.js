// Wrap your code in an event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration
    var firebaseConfig = {
		apiKey: "AIzaSyD9v0VqL47MtnVXUt39iaJIsxm1aAIp38g",
		authDomain: "supershy-database.firebaseapp.com",
		databaseURL: "https://supershy-database-default-rtdb.firebaseio.com",
		projectId: "supershy-database",
		storageBucket: "supershy-database.appspot.com",
		messagingSenderId: "54112195310",
		appId: "1:54112195310:web:d24469d3050522482619ff",
		measurementId: "G-7FKTCLNJDX"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initializing variables
    const auth = firebase.auth();
    const database = firebase.database();

    // Set up our register function
    function register() {
    // Get our input fields
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var fullname = document.getElementById('fullname').value;
    var address = document.getElementById('address').value;
    var phnum = document.getElementById('phnum').value;

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is not accepted, Please try again');
        return;
    }
    if (validate_field(fullname) == false || validate_field(address) == false || validate_field(phnum) == false) {
        alert("One or more extra fields is not accepted, Please try again");
        return;
    }
	
	if (!validateContactNumber(phnum)) {
		alert("Invalid contact number. A valid phone number consists of 11 digits and starts with '09' or '+639'. Example: 09123456789 or +639123456789");
		return;
	}
	
	// Move on with Auth
     auth.createUserWithEmailAndPassword(email, password)
        .then(function() {
            // Declare user variable
            var user = auth.currentUser;

            // Add the user to the Database
            var database_ref = database.ref();

            // Create User Data
            var user_data = {
                email: email,
                fullname: fullname,
                address: address,
                phnum: phnum,
                last_login: Date.now()
            };

            // Save user data to the database
            database_ref.child('users/' + user.uid).set(user_data)
                .then(function() {
                    // Alert user created message
                    alert('User Created! Redirecting to dashboard...');
                    // Redirect to dashboard after successful user data saving
                    window.location.href = "dashboard.html";
                })
                .catch(function(error) {
                    // Handle database error
                    console.error("Error saving user data:", error);
                    alert("Error saving user data. Please try again.");
                });
        })
        .catch(function(error) {
            // For errors to be alerted by Firebase
            var error_code = error.code;
            var error_message = error.message;
            alert(error_message);
        });
}

	var loginAttempts = 0;
	const maxLoginAttempts = 4;
	const loginTimeoutDuration = 15;

    // Set up our login function
    function login() {
        // Get all our input fields
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        // Validate input fields
        if (validate_email(email) == false || validate_password(password) == false) {
            alert('Email or Password is not accepted, Please try again');
            return;
        }
		
		// Disable the login button before sending the request
		var loginButton = document.getElementById('loginButton');
		 if (loginButton) {
			loginButton.disabled = true;
		  }
		clearInterval(window.timerInterval);
        auth.signInWithEmailAndPassword(email, password)
            .then(function() {
                // Declare user variable
                var user = auth.currentUser;

                // Add the user to the Database
                var database_ref = database.ref();

                // Create User Data
                var user_data = {
                    last_login: Date.now()
                };

                database_ref.child('users/' + user.uid).update(user_data);
				
				// Redirect to dashboard
                alert('User Logged In! Redirecting to dashboard...');
				window.location.href = "dashboard.html";
				loginAttempts = 0; // Reset attempts on successful login
			    loginButton.disabled = false; // Enable button again
			})
			.catch(function(error) {
			  loginAttempts++;

			  if (loginAttempts >= maxLoginAttempts) {
				  startTimer(loginTimeoutDuration);
			  } else {
				var errorMessage = "You have inputted incorrect credentials. Please try again.";
					  if (error.code === "auth/wrong-password") {
						errorMessage = "Invalid password. Please check your password and try again.";
					  } else if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
						errorMessage = "Invalid email address. Please check your email and try again.";
					  }
					  alert(errorMessage);
			  }
			  loginButton.disabled = false; // Enable button again for valid login attempts
			});
		}

		// Login timeout key (for localStorage)
		var loginTimeoutKey = "loginTimeout";

		function startTimer(duration) {
				var timerElement = document.getElementById('countdownTimer');
				var startTime = Date.now();
				var endTime = startTime + duration * 1000;

				if (window.timerInterval) {
					return; // Exit if a timer is already running
				}

				console.log("Starting timer...");

				window.timerInterval = setInterval(function() {
					var timeLeft = endTime - Date.now();
					if (timeLeft >= 0) {
						var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
						console.log("Time left:", seconds, "seconds");
						if (timerElement) {
							timerElement.innerHTML = "Please try again in " + seconds + " seconds.";
						}
					} else {
						console.log("Timer expired.");
						clearInterval(window.timerInterval);
						if (timerElement) {
							timerElement.innerHTML = "";
						}
						loginAttempts = 0; // Reset attempts after timeout
						var loginButton = document.getElementById('loginButton');
						if (loginButton) {
							loginButton.disabled = false; // Re-enable login button after timeout
						}
					}
				}, 1000);
			}


    function validate_email(email) {
        expression = /^[^@]+@\w+(\.\w+)+\w$/;
        if (expression.test(email) == true) {
            return true;
        } else {
            return false;
        }
    }

    function validate_password(password) {
        if (password.length < 6) { // Changed '<' to 'length <' to fix password validation
            return false;
        } else {
            return true;
        }
    }

    function validate_field(field) {
        if (field == null) {
            return false;
        }
        if (field.length <= 0) {
            return false;
        } else {
            return true;
        }
    }
	
	function validateContactNumber(contactNumber) {
        // Regular expression to match Philippines phone number format
        var regex = /^(09|\+639)\d{9}$/;

        // Check if the contact number matches the regex pattern
        return regex.test(contactNumber);
    }
	
  var registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default form submission behavior
            register(); // Call the register function
        });
    }

    // Get the login button element
    var loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default form submission behavior
            login(); // Call the login function
        });
    }

	var passwordInput = document.getElementById('password');
    var toggleButton = document.getElementById('togglePassword');
    
    toggleButton.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.classList.remove('fa-eye-slash');
            toggleButton.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            toggleButton.classList.remove('fa-eye');
            toggleButton.classList.add('fa-eye-slash');
        }
    });
	
    // Function to show forgot password modal
    function showForgotPasswordModal() {
        var modal = document.getElementById("forgotPasswordModal");
        modal.style.display = "block";
    }
    
    // Function to hide forgot password modal
    function hideForgotPasswordModal() {
        var modal = document.getElementById("forgotPasswordModal");
        modal.style.display = "none";
    }
    
    // Function to handle sending password reset email
    function sendPasswordResetEmail() {
        var email = document.getElementById('forgotPasswordEmail').value;
        
        firebase.auth().sendPasswordResetEmail(email)
            .then(function() {
                // Password reset email sent successfully
                alert("Password reset email sent. Check your email inbox.");
                hideForgotPasswordModal(); // Close the modal after sending email
            })
            .catch(function(error) {
                // An error occurred
                console.error("Error sending password reset email:", error);
                document.getElementById('forgotPasswordErrorMessage').textContent = error.message;
            });
    }
    
    // Event listener for forgot password link
    document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of anchor tag
        showForgotPasswordModal(); // Show the forgot password modal
    });
    
    // Event listener for close button in modal
    document.getElementsByClassName('close')[0].addEventListener('click', function() {
        hideForgotPasswordModal(); // Close the modal when close button is clicked
    });
    
    // Event listener for send reset email button
    document.getElementById('sendResetEmailButton').addEventListener('click', function() {
        sendPasswordResetEmail(); // Call the function to send password reset email
    });
 
});
