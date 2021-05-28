import React, { createContext } from "react";

export const USER_LOCATION_CONTEXT = createContext({
	location: null
})


export const UserLocationContextProvider = ({ location, ...props }) =>
{
	return (
		<USER_LOCATION_CONTEXT.Provider value={{ location }}>
			{props.children}
		</USER_LOCATION_CONTEXT.Provider>
	)
}