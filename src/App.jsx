import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import { Room, Login, Signup, Home, Settings } from "./pages";
import { ContextProvider } from "./context";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				exact
				path="/home"
				element={<Home />}
			/>
			<Route
				exact
				path="/"
				element={<Layout />}
			>
				<Route
					path="/@me/:id"
					element={<Room />}
				/>
			</Route>
			<Route
				path="/login"
				element={<Login />}
			/>
			<Route
				path="/signup"
				element={<Signup />}
			/>
			<Route
				path="/settings"
				element={<Settings to="/404" />}
			/>
			<Route
				path="*"
				element={<div>page not found 404</div>}
			/>
		</>
	)
);

const App = () => {

	return (
		<ContextProvider>
			<RouterProvider router={router} />
		</ContextProvider>
	)

};

export default App;
