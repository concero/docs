// Define CSS variables for global use
const rootStyles = document.documentElement.style
rootStyles.setProperty('--accent-50', '#f3f1fe')
rootStyles.setProperty('--accent-100', '#efebfe')
rootStyles.setProperty('--accent-200', '#d9d2fb')
rootStyles.setProperty('--accent-400', '#ad9ff6')
rootStyles.setProperty('--accent-600', '#7e54f1')
rootStyles.setProperty('--accent-700', '#5925e6')
rootStyles.setProperty('--accent-800', '#3b13a8')
rootStyles.setProperty('--accent-900', '#210b5f')

// Export style objects for component use
export const conceroStyles = {
	textAccentHover: {
		light: '#7e54f1', // accent-600
		dark: '#ad9ff6', // accent-400
	},
	borderAccent: {
		light: '#f3f1fe', // accent-50
		dark: '#210b5f', // accent-900
	},
	backgroundAccent: {
		light: '#f3f1fe', // accent-50
		dark: '#210b5f', // accent-900
	},
	backgroundAccentHover: {
		light: '#d9d2fb', // accent-200
		dark: '#3b13a8', // accent-800
	},
	backgroundAccentText: {
		light: '#5925e6', // accent-700
		dark: '#efebfe', // accent-100
	},
	textAccent: {
		light: '#7e54f1', // accent-600
		dark: '#ad9ff6', // accent-400
	},
}
