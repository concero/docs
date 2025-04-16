import { useState, useEffect } from 'react'
import { GITHUB_REPOSITORIES, ROUTER_PROXY_CONFIG, NetworkEnvironment } from '../constants/config'

interface RouterAddress {
	network: string
	address: string
}

interface RouterProxyAddressesProps {
	environment?: NetworkEnvironment
}

export function RouterProxyAddresses({ environment = 'testnet' }: RouterProxyAddressesProps) {
	const [addresses, setAddresses] = useState<RouterAddress[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchAddresses = async () => {
			try {
				setIsLoading(true)

				const deploymentFile =
					environment === 'testnet'
						? GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.FILES.TESTNET_DEPLOYMENTS
						: GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.FILES.MAINNET_DEPLOYMENTS

				const deploymentUrl = `${GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.BASE_URL}${deploymentFile}`

				const response = await fetch(deploymentUrl)

				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status}`)
				}

				const text = await response.text()
				const routerProxyAddresses = parseRouterAddresses(text)

				setAddresses(routerProxyAddresses)
			} catch (err) {
				console.error('Error fetching router addresses:', err)
				setError(err instanceof Error ? err.message : 'Unknown error occurred')
			} finally {
				setIsLoading(false)
			}
		}

		fetchAddresses()
	}, [environment])

	const parseRouterAddresses = (text: string): RouterAddress[] => {
		const routerProxyAddresses: RouterAddress[] = []

		text.split('\n').forEach(line => {
			if (line.includes(ROUTER_PROXY_CONFIG.VARIABLE_PREFIX) && !line.includes(ROUTER_PROXY_CONFIG.ADMIN_SUFFIX)) {
				const parts = line.split('=')
				if (parts.length === 2) {
					const key = parts[0].trim()
					const address = parts[1].trim()
					const network = key.replace(`${ROUTER_PROXY_CONFIG.VARIABLE_PREFIX}_`, '')

					routerProxyAddresses.push({ network, address })
				}
			}
		})

		return routerProxyAddresses
	}

	if (isLoading) {
		return <p>Loading router proxy addresses...</p>
	}

	if (error) {
		return (
			<div className="error-message">
				<p>Error loading router proxy addresses: {error}</p>
				<p>
					Note: If you're experiencing CORS issues, you may need to use a CORS proxy or configure your server to allow
					cross-origin requests.
				</p>
			</div>
		)
	}

	return (
		<div className="router-proxy-addresses">
			<p>The following router proxy addresses are available on {environment} networks:</p>
			{addresses.length === 0 ? (
				<p>No router proxy addresses found.</p>
			) : (
				<ul>
					{addresses.map((item, index) => (
						<li key={index}>
							<strong>{item.network}:</strong> <code>{item.address}</code>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default RouterProxyAddresses
