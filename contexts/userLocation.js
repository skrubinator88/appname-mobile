import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../components/context";
import PermissionsControllers from "../controllers/PermissionsControllers";
import config from "../env";


export const USER_LOCATION_CONTEXT = createContext({
	/**
	 * {
			* coords: {
				latitude: number;
				longitude: number;
				altitude: number | null;
				accuracy: number | null;
				altitudeAccuracy: number | null;
				heading: number | null;
				speed: number | null;
			}
		};
	 */
	location: null,
	setLocation: () => { },
	getCurrentLocation: async () => { },
	saveLocationToServer: async (location) => { },
})


export const UserLocationContextProvider = (props) => {
	const [location, setLocation] = useState(null);
	const { authState } = useContext(GlobalContext);

	const getCurrentLocation = async () => {
		return await PermissionsControllers
			.getLocation()
			.then((position) => {
				setLocation(position)
				return position
			})
			.then(async (location) => {
				try {
					await saveLocationToServer(location)
				} catch (e) {
					console.log("Failed to save location", e)
				}
			});
	}

	const saveLocationToServer = async (location) => {
		if (location && location.coords) {
			const apiResponse = await fetch(`${config.API_URL}/location`, {
				method: "POST",
				headers: {
					Authorization: `bearer ${authState.userToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					location: location?.coords
				}),
			});
			if (!apiResponse.ok) {
				throw new Error((await apiResponse.json()).message || "Failed to save location");
			}
		}
		return true;
	}

	// Get app necessary permissions
	// Get location once
	useEffect(() => {
		getCurrentLocation()
	}, []);

	return (
		<USER_LOCATION_CONTEXT.Provider value={{ location, setLocation, getCurrentLocation, saveLocationToServer, }}>
			{props.children}
		</USER_LOCATION_CONTEXT.Provider>
	)
}