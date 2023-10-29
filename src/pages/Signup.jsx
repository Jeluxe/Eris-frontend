import React from "react";
import { useField } from "../hooks";
import AuthLayout from "../components/AuthLayout";

const Signup = () => {
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

	const signup = () => {
		const signupInfo = {
			email: email.value,
			username: username.value,
			password: password.value,
			confirmPassword: confirmPassword.value
		}
		// validateFields(loginInfo)
		// sendToServer(loginInfo)
		reset()
	}

	return <AuthLayout
		fields={{ email, username, password, confirmPassword }}
		button={{ action: signup, content: "Signup" }}
		link={{ href: "/login", content: "Already signed up? Click Here!" }}
	/>
};

export default Signup;
