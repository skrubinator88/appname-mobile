import { createContext } from "react";

export const ErrorContext = createContext();

/**
 * It provides with the use of useContext these objects:
 *
 * @param authState — It holds current user information such as name, ID, authentication token,
 *
 * @param authActions — Authentication functions: signOut , signIn
 *
 * @param errorActions — Error Handler functions: setError
 *
 * @example
 * import React, { useContext } from 'react'
 *
 * import { GlobalContext } from "./components/context";
 *
 * export const Component = () => {
 *   const { authState, authActions, errorActions } = useContext(GlobalContext);
 * }
 **/
export const GlobalContext = createContext();

export const UIOverlayContext = createContext();

export const RegistrationContext = createContext();
