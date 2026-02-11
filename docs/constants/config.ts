export const GITHUB_REPOSITORIES = {
	MESSAGING_CONTRACTS_V2: {
		BASE_URL: 'https://raw.githubusercontent.com/concero/messaging-contracts-v2/refs/heads/master',
		FILES: {
			TESTNET_DEPLOYMENTS: '/.env.deployments.testnet',
			MAINNET_DEPLOYMENTS: '/.env.deployments.mainnet',
		},
	},
	RPCS: {
		SUPPORTED_NETWORKS_URL:
			'https://raw.githubusercontent.com/concero/rpcs/feature/refactor/output/supported-chains.json',
		MAINNET_RPCS_URL: 'https://raw.githubusercontent.com/concero/rpcs/refs/heads/master/output/mainnet.json',
	},
	V2_NETWORKS: {
		NETWORKS_URL: 'https://raw.githubusercontent.com/concero/v2-networks/refs/heads/master/networks',
		MAINNET_NETWORKS_URL: 'https://raw.githubusercontent.com/concero/v2-networks/refs/heads/master/networks/mainnet.json',
		TESTNET_NETWORKS_URL: 'https://raw.githubusercontent.com/concero/v2-networks/refs/heads/master/networks/testnet.json',
	},
	CONCERO_NETWORKS: 'https://raw.githubusercontent.com/concero/concero-networks/refs/heads/master/output/chains.json',
}

export const ROUTER_PROXY_CONFIG = {
	VARIABLE_PREFIX: 'CONCERO_ROUTER_PROXY',
	ADMIN_SUFFIX: '_ADMIN',
}

export type NetworkEnvironment = 'testnet' | 'mainnet'
