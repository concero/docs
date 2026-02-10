import { defineConfig } from 'vocs'

export default defineConfig({
	title: 'Concero Docs',
	titleTemplate: '%s – Concero Docs',
	editLink: {
		pattern: 'https://github.com/concero/docs/edit/master/docs/pages/:path',
		text: 'Suggest changes to this page',
	},
	// head() {
	//    return (
	//      <>
	//        <script src="https://cdn.usefathom.com/script.js" data-site="IBTUTKMT" defer />
	//      </>
	//    )
	//  },
	// banner: 'Head to our new [Discord](https://discord.gg/lanca)!',
	description: 'Build the next big thing on Concero.',
	baseUrl: 'https://docs.concero.io',
	iconUrl: 'https://concero.io/favicon.ico',
	logoUrl: {
		light: '/logo-light.svg',
		dark: '/logo-dark.svg',
	},
	theme: {
		accentColor: {
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
		},
	},
	rootDir: 'docs',
	// font: {
	//   google: 'Manrope'
	// },
	topNav: [
		// {
		// 	text: 'V1 Whitepaper',
		// 	link: 'https://www.concero.io/whitepaper.pdf',
		// },
		//

		{
			text: 'Code Repositories',
			items: [
				{
					text: 'V2 Messaging Contracts',
					link: 'http://github.com/concero/messaging-contracts-v2',
				},
				{
					text: 'V2 Operators',
					link: 'http://github.com/concero/v2-operators',
				},
			],
		},
		{
			text: 'Concero V2 Whitepaper',
			link: 'https://concero.io/v2_whitepaper.pdf',
		},
		{
			text: 'Concero Scan',
			link: 'https://scan.concero.io',
		},
	],
	socials: [
		{
			icon: 'discord',
			link: 'https://discord.gg/lanca',
		},
		{
			icon: 'github',
			link: 'https://github.com/concero',
		},
		{
			icon: 'x',
			link: 'https://twitter.com/concero_io',
		},
	],
	sidebar: [
		{
			text: 'Introduction to Concero',
			collapsed: false,
			items: [
				{
					text: 'What is Concero?',
					link: '/technical-architecture/what-is-concero',
				},
				{
					text: 'Technical Architecture',
					link: '/technical-architecture/technical-architecture',
				},
				// {
				// 	text: 'Concero V2 Scalability',
				// 	link: '/technical-architecture/concero-v2-scalability',
				// },
				{
					text: 'Chainlink CRE as Verifier',
					link: '/technical-architecture/cre-as-verifier',
				},
				{
					text: 'Relayers',
					link: '/technical-architecture/relayers',
				},
				// {
				// 	text: 'Deployment Pipeline',
				// 	link: '/technical-architecture/deployment-pipeline',
				// },
			],
		},
		{
			text: 'Integrate as a dApp',
			collapsed: false,
			items: [
				// {
				// 	text: 'Overview',
				// 	link: '/integrate-concero/overview',
				// },
				{
					text: 'Getting Started',
					link: '/integrate-concero/getting-started',
				},
				{
					text: 'Integration Overview',
					link: '/integrate-concero/overview',
				},
				{
					text: 'Set up ConceroClient',
					link: '/integrate-concero/set-up-conceroclient',
				},
				{
					text: 'Send a message',
					link: '/integrate-concero/send-a-message',
				},
				{
					text: 'Receive a message',
					link: '/integrate-concero/receive-a-message',
				},
				{
					text: 'Track a message',
					link: '/integrate-concero/track-a-message',
				},
				{
					text: 'Troubleshooting',
					link: '/integrate-concero/troubleshooting',
				},
			],
		},
		{
			text: 'Integrate as a Chain',
			collapsed: true,
			items: [
				{
					text: 'Add your network to Concero',
					link: '/integrate-concero/add-your-network',
				},
			],
		},

		{
			text: 'Deployments',
			link: '/integrate-concero/supported-networks',
		},
		// {
		// 	text: 'Getting Started',
		// 	link: '/getting-started',
		// },
		// {
		// 	text: 'Liquidity Infrastructure',
		// 	link: '/cross-chain-liquidity-infrastructure/architecture',
		// 	collapsed: true,
		// 	items: [
		// 		{
		// 			text: 'Architecture',
		// 			link: '/cross-chain-liquidity-infrastructure/architecture',
		// 		},
		// 		{
		// 			text: 'Interface',
		// 			link: '/cross-chain-liquidity-infrastructure/interface',
		// 		},
		// 		{
		// 			text: 'Deployments',
		// 			link: '/cross-chain-liquidity-infrastructure/deployments',
		// 		},
		// 	],
		// },
	],
})
