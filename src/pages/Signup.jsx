import axios from "axios";
import { useNavigate } from "react-router";
import { AuthLayout } from "../components";
import { useField } from "../hooks";

const Signup = () => {
	const navigate = useNavigate();
	const { reset: emailReset, ...email } = useField('text');
	const { reset: usernameReset, ...username } = useField('text');
	const { reset: passwordReset, ...password } = useField('password');
	const { reset: confirmPasswordReset, ...confirmPassword } = useField('password');

	const resetFields = () => {
		emailReset();
		usernameReset();
		passwordReset();
		confirmPasswordReset();
	}

	const signup = async () => {
		const signupInfo = {
			email: email.value,
			username: username.value,
			password: password.value,
			confirmPassword: confirmPassword.value
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email.value)) {
			alert('Please enter a valid email address.');
			return;
		}

		// Username validation
		const usernameRegex = /^[a-zA-Z0-9_]+$/;
		if (!usernameRegex.test(username.value)) {
			alert('Username can only contain alphanumeric characters and underscores.');
			return;
		}

		// Password strength validation
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,24}$/;
		if (!passwordRegex.test(password.value)) {
			let errorMessage = 'Password must meet the following criteria:';
			if (password.value.length < 8 && password.value.length > 24) {
				errorMessage += '\n- Be between 8 to 24 characters long';
			}
			if (!/(?=.*[a-z])/.test(password.value)) {
				errorMessage += '\n- Contain at least one lowercase letter';
			}
			if (!/(?=.*[A-Z])/.test(password.value)) {
				errorMessage += '\n- Contain at least one uppercase letter';
			}
			if (!/(?=.*\d)/.test(password.value)) {
				errorMessage += '\n- Contain at least one digit';
			}
			if (!/(?=.*[^\da-zA-Z])/.test(password.value)) {
				errorMessage += '\n- Contain at least one special character';
			}
			alert(errorMessage);
			return;
		}

		if (password.value !== confirmPassword.value) {
			alert('passwords not match');
			return;
		}

		if (/\s+/.test(email.value) || spacesRegex.test(username.value) || spacesRegex.test(password.value)) {
			alert('No spaces allowed in email, username, or password.');
			return;
		}

		try {
			const response = await axios.post('/api/sign-up', signupInfo);

			if (response.status === 201) {
				resetFields();
				navigate('/login');
			}
		} catch (error) {
			if (error?.response?.data?.error) {
				alert(error.response.data.error);
			} else {
				console.error('Error signing up:', error);
				alert('An error occurred while signing up. Please try again later.');
			}
		}
	}

	return <AuthLayout
		fields={{ email, username, password, confirmPassword }}
		button={{ action: signup, content: "Signup" }}
		link={{ href: "/login", content: "Already signed up? Click Here!" }}
	/>
};

export default Signup;
