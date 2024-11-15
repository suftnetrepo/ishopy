import React, { useState, useEffect, createContext } from "react";
import { saveOne, getOne } from "../../store/single-store";

const AppContext = createContext();

const initialState = {
	seller: null,
	user: null,
	categories: [],
	token: null,
};

export const AppProvider = ({ children }) => {
	const [state, setState] = useState(initialState);
	const [reload, setReload] = React.useState(false);
	const [from, setFrom] = React.useState(false);

	useEffect(() => {
		async function loadData() {
			try {
				const [seller = {}, user = {}, token = {}] = await Promise.all([
					getOne("SELLER"),
					getOne("USER"),
					getOne("TOKEN")
				]);

				setState(prevState => ({
					...prevState,
					seller,
					user,
					token
				}));

			} catch (error) {
				console.error('Failed to load state:', error);
			}
		}

		loadData();
	}, []);

	const actions = {
		saveCategory: async (categories) => {
			setState((pre) => {
				return {
					...pre,
					categories
				}
			});
		},
		saveUser: async (params) => {
			const { customer, token } = params
			setState((pre) => {
				return {
					...pre,
					user: customer,
					token
				}
			});

			try {
				await saveOne("USER", customer)
				await saveOne("TOKEN", token)
			} catch (error) {
				console.error('Failed to save state:', error);
			}
		},
		saveSeller: async (params) => {
			const { seller } = params || {};

			setState((pre) => {
				return {
					...pre,
					seller
				}
			});

			try {
				await saveOne("SELLER", seller);
				await saveOne("STRIPE_CUSTOMER", null)
			} catch (error) {
				console.error('Failed to save state:', error);
			}
		},
		clear: async () => {
			setState(initialState);

			try {
				await Promise.all([
					saveOne("SELLER", null),
					saveOne("USER", null),
					saveOne("TOKEN", null),
				]);
			} catch (error) {
				console.error('Failed to clear state:', error);
			}
		},
		
		updateCurrentUser: async (currentUser) => {
			setState((prevState) => ({ ...prevState, user: currentUser }));
			await saveOne("USER", currentUser)
		},
		logout: async () => {
			try {
			
				try {
					await Promise.all([		
						saveOne("SELLER", null),				
						saveOne("USER", null),
						saveOne("TOKEN", null),
					]);
				} catch (error) {
					console.error('Failed to clear state:', error);
				}
			} catch (error) {
				console.error('Failed to remove state from local storage:', error);
			}
		},
	}

	return (
		<AppContext.Provider
			value={{
				...actions, reload, setReload, from, setFrom, ...state
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
export const useAppContext = () => React.useContext(AppContext);

