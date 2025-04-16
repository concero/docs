import { useState, useEffect } from 'react'
import { GITHUB_REPOSITORIES, ROUTER_PROXY_CONFIG, NetworkEnvironment } from '../constants/config'

interface RouterAddress {
	network: string
	address: string
	id: string
}

interface RouterProxyAddressesProps {
	environment?: NetworkEnvironment
}

export function RouterProxyAddresses({ environment = 'testnet' }: RouterProxyAddressesProps) {
	const [addresses, setAddresses] = useState<RouterAddress[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null)

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
					const id = `${network}-${address}`

					routerProxyAddresses.push({ network, address, id })
				}
			}
		})

		return routerProxyAddresses
	}

	const copyToClipboard = async (text: string, id: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedAddressId(id)
			setTimeout(() => setCopiedAddressId(null), 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	const CopyIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
		</svg>
	)

	const CheckIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	)

	if (isLoading) {
		return <div className="loading">Loading router proxy addresses...</div>
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
			<h2>Router Proxy Addresses - {environment}</h2>
			{addresses.length === 0 ? (
				<p>No router proxy addresses found.</p>
			) : (
				<div className="table-container">
					<table className="address-table">
						<thead>
							<tr>
								<th>Network</th>
								<th>Address</th>
							</tr>
						</thead>
						<tbody>
							{addresses.map(item => (
								<tr key={item.id}>
									<td className="network-name">{item.network}</td>
									<td className="address-cell">
										<div className="address-wrapper">
											<code>{item.address}</code>
											<button
												className={`copy-icon-button ${copiedAddressId === item.id ? 'copied' : ''}`}
												onClick={() => copyToClipboard(item.address, item.id)}
												title="Copy address to clipboard"
												aria-label="Copy address"
											>
												{copiedAddressId === item.id ? <CheckIcon /> : <CopyIcon />}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<style jsx>{`
				.router-proxy-addresses {
					margin: 20px 0;
					font-family: var(--vocs-font-sans);
				}
				.table-container {
					overflow-x: auto;
				}
				.address-table {
					width: 100%;
					border-collapse: collapse;
					margin-top: 15px;
					box-shadow: 0 1px 3px var(--vocs-shadow-color);
					border-radius: 5px;
					overflow: hidden;
				}
				.address-table thead {
					background-color: var(--vocs-background-subtle);
				}
				.address-table th {
					font-weight: 300;
					color: var(--vocs-foreground);
					text-align: left;
					border-bottom: 1px solid var(--vocs-border-color);
					padding: 12px 15px;
				}
				.address-table td {
					padding: 12px 15px;
					text-align: left;
					border-bottom: 1px solid var(--vocs-border-color);
				}
				.address-table tbody tr:hover {
					background-color: var(--vocs-background-hover);
				}
				.network-name {
					font-weight: 400;
					color: var(--vocs-foreground);
				}
				.address-cell {
					font-family: var(--vocs-font-mono);
					word-break: break-all;
				}
				.address-wrapper {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 10px;
				}
				.copy-icon-button {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 28px;
					height: 28px;
					border: none;
					border-radius: 4px;
					background-color: var(--vocs-color_backgroundAccent);
					color: var(--vocs-color_textAccent);
					cursor: pointer;
					transition: all 0.2s ease;
					flex-shrink: 0;
				}
				.copy-icon-button:hover {
					background-color: var(--vocs-color_backgroundAccentHover);
					color: var(--vocs-color_textAccentHover);
				}
				.copy-icon-button.copied {
					background-color: var(--accent-600);
					color: var(--accent-100);
				}
				.loading,
				.error-message {
					padding: 15px;
					border-radius: 5px;
				}
				.loading {
					background-color: var(--vocs-color_borderAccent);
					color: var(--vocs-color_textAccent);
				}
				.error-message {
					background-color: var(--vocs-error-background);
					color: var(--vocs-error-text);
					border-left: 4px solid var(--vocs-error-text);
				}
			`}</style>
		</div>
	)
}

export default RouterProxyAddresses
