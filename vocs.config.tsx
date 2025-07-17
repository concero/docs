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
	ogImageUrl: {
		'/': '/og.png',
		'/docs': 'https://docs.concero.io/og?logo=%logo&title=%title&description=%description',
	},

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
			text: 'V2 Whitepaper',
			link: 'https://concero.io/v2_whitepaper.pdf',
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
			text: 'Get Started',
			collapsed: false,
			items: [
				// {
				// 	text: 'Overview',
				// 	link: '/get-started/overview',
				// },
				{
					text: 'Send a message',
					link: '/get-started/send-a-message',
				},
				{
					text: 'Receive a message',
					link: '/get-started/receive-a-message',
				},
				{
					text: 'Add your network',
					link: '/get-started/add-your-network',
				},
				{
					text: 'Deployments',
					link: '/get-started/deployments',
				},
				{
					text: 'Supported Networks',
					link: '/get-started/supported-networks',
				},
			],
		},
		{
			text: 'Protocol',
			collapsed: false,
			items: [
				{
					text: 'Concero V2 Architecture',
					link: '/concero-v2',
				},
				{
					text: 'Concero V2 Scalability',
					link: '/concero-v2-scalability',
				},{
					text: 'Chainlink Functions as verifier',
					link: '/clf-as-verifier',
				},
				{
					text: 'Relayers',
					link: '/relayers',
				},
				{
					text: 'Deployment Pipeline',
					link: '/deployment-pipeline',
				}
			],
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
