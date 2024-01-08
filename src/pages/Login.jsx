import axios from 'axios';
import { useNavigate } from 'react-router';
import AuthLayout from "../components/AuthLayout";
import { useField } from "../hooks";

const Login = () => {
	const navigate = useNavigate()
	const { reset: emailReset, ...email } = useField('text')
	const { reset: passwordReset, ...password } = useField('password')

	const reset = () => {
		emailReset()
		passwordReset()
	}

	const login = async () => {
		const loginInfo = { email: email.value, password: password.value }
		// validateFields(loginInfo)
		try {
			const response = await axios.post('/api/sign-in', loginInfo)
			if (response.status === 200) {
				reset()
				navigate('/')
			}
		} catch (error) {
			console.log(error)
		}
	}

	return <AuthLayout
		fields={{ email, password }}
		button={{ action: login, content: "Login" }}
		link={{ href: "/signup", content: "Not signed up yet? Click Here!" }}
	/>
};

export default Login;
