import { useField } from "../hooks";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
	const { reset: usernameReset, ...username } = useField('text')
	const { reset: passwordReset, ...password } = useField('password')

	const reset = () => {
		usernameReset()
		passwordReset()
	}

	const login = () => {
		const loginInfo = { username: username.value, password: password.value }
		// validateFields(loginInfo)
		// sendToServer(loginInfo)
		reset()
	}

	return <AuthLayout
		fields={{ username, password }}
		button={{ action: login, content: "Login" }}
		link={{ href: "/signup", content: "Not signed up yet? Click Here!" }}
	/>
};

export default Login;
