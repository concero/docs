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
	// theme: {
	// 	// accentColor: '#5E43FF',
	// },
	rootDir: 'docs',
	ogImageUrl: {
		'/': '/og.png',
		'/docs': 'https://docs.concero.io/og?logo=%logo&title=%title&description=%description',
	},

	// font: {
	//   google: 'Manrope'
	// },
	topNav: [
		{
			text: 'Get in touch',
			link: 'mailto:support@concero.io',
		},
		{
			text: 'Whitepaper',
			link: 'https://www.concero.io/whitepaper.pdf',
		},
		{
			text: 'Audits (soon)',
			link: '#',
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
			text: 'What is Concero?',
			link: '/what-is-concero',
		},
		// {
		// 	text: 'Getting Started',
		// 	link: '/getting-started',
		// },
		{
			text: 'Infrastructure',
			collapsed: false,
			items: [
				{
					text: 'Overview',
					link: '/cross-chain-infrastructure/overview',
				},
				{
					text: 'Interface',
					link: '/cross-chain-infrastructure/interface',
				},
				{
					text: 'Fees',
					link: '/cross-chain-infrastructure/fees',
				},
				{
					text: 'Architecture',
					link: '/cross-chain-infrastructure/technical-architecture',
				},
				{
					text: 'Routing',
					link: '/cross-chain-infrastructure/routing',
				},
				{
					text: 'Tracking',
					link: '/cross-chain-infrastructure/tracking',
				},
				{
					text: 'Messaging (soon)',
					link: '/cross-chain-infrastructure/messaging',
				},
				{
					text: 'Deployments',
					link: '/cross-chain-infrastructure/deployments',
				},
			],
		},
		{
			text: 'Liquidity Infrastructure',
			link: '/cross-chain-liquidity-infrastructure/architecture',
			collapsed: false,
			items: [
				{
					text: 'Architecture',
					link: '/cross-chain-liquidity-infrastructure/architecture',
				},
				{
					text: 'Interface',
					link: '/cross-chain-liquidity-infrastructure/interface',
				},
				{
					text: 'Deployments',
					link: '/cross-chain-liquidity-infrastructure/deployments',
				},
			],
		},
		{
			text: 'JS SDK (coming soon)',
			// link: '/concero-js-sdk',
			// items: [
			// 	{
			// 		text: 'Overview',
			// 		link: '/js-sdk/overview',
			// 	},
			// 	{
			// 		text: 'Installation',
			// 		link: '/js-sdk/installation',
			// 	},
			// 	{
			// 		text: 'Usage',
			// 		link: '/js-sdk/usage',
			// 	},
			//
			// ]
		},
		{
			text: 'API Endpoints (coming soon)',
			// link: '/api-endpoints',
			// items: [
			// 	{
			// 		text: 'Overview',
			// 		link: '/api/overview',
			// 	},
			// 	{
			// 		text: 'Routing',
			// 		link: '/api/routing',
			// 	},
			// 	{
			// 		text: 'Tracking',
			// 		link: '/api/tracking',
			// 	},
			//
			// ]
		},
	],
})
