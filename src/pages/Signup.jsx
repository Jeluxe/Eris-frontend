import axios from "axios";
import { useNavigate } from "react-router";
import { AuthLayout } from "../components";
import { useField } from "../hooks";

const Signup = () => {
	const navigate = useNavigate()
	const { reset: emailReset, ...email } = useField('text')
	const { reset: usernameReset, ...username } = useField('text')
	const { reset: passwordReset, ...password } = useField('password')
	const { reset: confirmPasswordReset, ...confirmPassword } = useField('password')

	const reset = () => {
		emailReset()
		usernameReset()
		passwordReset()
		confirmPasswordReset()
	}

	const signup = async () => {
		const signupInfo = {
			email: email.value,
			username: username.value,
			password: password.value,
			confirmPassword: confirmPassword.value
		}

		if (!email.value.includes("@")) {
			alert('not an email');
			return;
		}

		if (!email.value.trim().length) {
			alert('not an email');
			return;
		}

		if (email.value.length < 8 || email.value.length > 65) {
			alert('email not match the allowed length');
			return;
		}

		if (!username.value.trim().length) {
			alert("username must contain characters")
			return;
		}

		if (username.value.length < 6 || username.value.length > 24) {
			alert("username not match the allowed length")
			return;
		}

		if (!password.value.trim().length) {
			alert("password must contain characters")
			return;
		}

		if (password.value.length < 6 || password.value.length > 24) {
			alert("password not match the allowed length")
			return;
		}
		const spacesRegex = /\s/g
		const upperCaseRegex = /[A-Z]/g
		const lowerCaseRegex = /[a-z]/g
		const digitRegex = /[0-9]/g
		const specialCharRegex = /[^a-zA-Z0-9]/g

		if (spacesRegex.test(email.value)) {
			alert('no spaces allowed')
			return;
		}
		if (spacesRegex.test(username.value)) {
			alert('no spaces allowed')
			return;
		}
		if (spacesRegex.test(password.value)) {
			alert('no spaces allowed')
			return;
		}
		if (!upperCaseRegex.test(password.value)) {
			alert('no upper case')
			return;
		}
		if (!lowerCaseRegex.test(password.value)) {
			alert('no lower case')
			return;
		}
		if (!digitRegex.test(password.value)) {
			alert('no digit')
			return;
		}
		if (!specialCharRegex.test(password.value)) {
			alert('no special character')
			return;
		}

		if (password.value !== confirmPassword.value) {
			alert('passwords not match');
			return;
		}
		try {

			const response = await axios.post('/api/sign-up', signupInfo)

			if (response.status === 201) {
				reset()
				navigate('/login')
			}
		} catch (error) {
			console.log(error.response.data.error)
		}
	}

	return <AuthLayout
		fields={{ email, username, password, confirmPassword }}
		button={{ action: signup, content: "Signup" }}
		link={{ href: "/login", content: "Already signed up? Click Here!" }}
	/>
};

export default Signup;
