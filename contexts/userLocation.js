import React, { createContext, useCallback, useEffect, useState } from "react";
import PermissionsControllers from "../controllers/PermissionsControllers";


export const USER_LOCATION_CONTEXT = createContext({
	location: null,
	setLocation: () => { },
	getCurrentLocation: () => { },
})


export const UserLocationContextProvider = (props) =>
{
	const [location, setLocation] = useState(null);

	const getCurrentLocation = () =>
	{
		return PermissionsControllers.getLocation().then((position) => setLocation(position));
	}

	// Get app necessary permissions
	// Get location once
	useEffect(() =>
	{
		getCurrentLocation()
	}, []);

	return (
		<USER_LOCATION_CONTEXT.Provider value={{ location, setLocation, getCurrentLocation }}>
			{props.children}
		</USER_LOCATION_CONTEXT.Provider>
	)
}