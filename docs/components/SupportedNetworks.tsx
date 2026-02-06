import { useState, useEffect } from 'react'
import Switch from './Switch'
import { GITHUB_REPOSITORIES } from '../constants/config'

interface NetworkData {
	routerProxy: string
	priceFeedProxy?: string
	relayerLibProxy?: string
	creValidatorLibProxy?: string
}

interface NetworksMap {
	[networkName: string]: NetworkData
}

type NetworkEnvironment = 'mainnet' | 'testnet'

function formatNetworkName(name: string): string {
	return name
		.replace(/_PROXY$/, '')
		.toLowerCase()
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}

	return (
		<button
			onClick={handleCopy}
			title={copied ? 'Copied!' : 'Copy to clipboard'}
			style={{
				marginLeft: '8px',
				padding: '4px',
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: '4px',
				backgroundColor: 'transparent',
				border: '1px solid var(--vocs-color_tableBorder)',
				cursor: 'pointer',
				color: copied ? '#4ade80' : 'var(--vocs-color_text)',
				transition: 'all 0.2s',
				flexShrink: 0,
			}}
		>
			{copied ? (
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			) : (
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			)}
		</button>
	)
}

function NetworkList({
	networks,
	environment,
	searchTerm,
}: {
	networks: NetworksMap | null
	environment: NetworkEnvironment
	searchTerm: string
}) {
	if (!networks) {
		return null
	}

	const filteredNetworks = Object.entries(networks)
		.filter(([networkName]) => formatNetworkName(networkName).toLowerCase().includes(searchTerm.toLowerCase()))
		.sort(([a], [b]) => formatNetworkName(a).localeCompare(formatNetworkName(b)))

	const networkCount = filteredNetworks.length

	return (
		<div style={{ marginTop: 'var(--spacing-lg)' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'baseline',
					borderBottom: '1px solid var(--vocs-color_tableBorder)',
					paddingBottom: 'var(--spacing-sm)',
					marginBottom: 'var(--spacing-md)',
				}}
			>
				<h3 style={{ margin: 0 }}>
					{environment === 'mainnet' ? 'Mainnet' : 'Testnet'} Networks ({networkCount} chains)
				</h3>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--spacing-lg)',
				}}
			>
				{filteredNetworks.map(([networkName, networkData]) => (
					<div
						key={networkName}
						style={{
							paddingBottom: 'var(--spacing-lg)',
							borderBottom: '1px solid var(--vocs-color_tableBorder)',
						}}
					>
						<div
							style={{
								fontWeight: '600',
								marginBottom: 'var(--spacing-md)',
								fontSize: '1.2rem',
								color: 'var(--vocs-color_text)',
							}}
						>
							{formatNetworkName(networkName)}
						</div>

						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 'var(--spacing-sm)',
							}}
						>
							<div
								style={{
									fontSize: '0.9rem',
									color: 'gray',
									display: 'flex',
									alignItems: 'baseline',
									gap: '8px',
									flexWrap: 'wrap',
								}}
							>
								<strong style={{ whiteSpace: 'nowrap', color: 'var(--vocs-color_text)', width: '140px' }}>
									Router:
								</strong>
								<span
									style={{
										wordBreak: 'break-all',
										fontFamily: 'monospace',
										display: 'inline-flex',
										alignItems: 'center',
									}}
								>
									{networkData.routerProxy}
									<CopyButton text={networkData.routerProxy} />
								</span>
							</div>

							{networkData.priceFeedProxy && (
								<div
									style={{
										fontSize: '0.9rem',
										color: 'gray',
										display: 'flex',
										alignItems: 'baseline',
										gap: '8px',
										flexWrap: 'wrap',
									}}
								>
									<strong
										style={{ whiteSpace: 'nowrap', color: 'var(--vocs-color_text)', width: '140px' }}
									>
										Price Feed:
									</strong>
									<span
										style={{
											wordBreak: 'break-all',
											fontFamily: 'monospace',
											display: 'inline-flex',
											alignItems: 'center',
										}}
									>
										{networkData.priceFeedProxy}
										<CopyButton text={networkData.priceFeedProxy} />
									</span>
								</div>
							)}

							{networkData.relayerLibProxy && (
								<div
									style={{
										fontSize: '0.9rem',
										color: 'gray',
										display: 'flex',
										alignItems: 'baseline',
										gap: '8px',
										flexWrap: 'wrap',
									}}
								>
									<strong
										style={{ whiteSpace: 'nowrap', color: 'var(--vocs-color_text)', width: '140px' }}
									>
										Relayer Lib:
									</strong>
									<span
										style={{
											wordBreak: 'break-all',
											fontFamily: 'monospace',
											display: 'inline-flex',
											alignItems: 'center',
										}}
									>
										{networkData.relayerLibProxy}
										<CopyButton text={networkData.relayerLibProxy} />
									</span>
								</div>
							)}

							{networkData.creValidatorLibProxy && (
								<div
									style={{
										fontSize: '0.9rem',
										color: 'gray',
										display: 'flex',
										alignItems: 'baseline',
										gap: '8px',
										flexWrap: 'wrap',
									}}
								>
									<strong
										style={{ whiteSpace: 'nowrap', color: 'var(--vocs-color_text)', width: '140px' }}
									>
										CRE Validator Lib:
									</strong>
									<span
										style={{
											wordBreak: 'break-all',
											fontFamily: 'monospace',
											display: 'inline-flex',
											alignItems: 'center',
										}}
									>
										{networkData.creValidatorLibProxy}
										<CopyButton text={networkData.creValidatorLibProxy} />
									</span>
								</div>
							)}
						</div>
					</div>
				))}
				{filteredNetworks.length === 0 && (
					<div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'gray' }}>
						No networks found matching "{searchTerm}"
					</div>
				)}
			</div>
		</div>
	)
}

export function SupportedNetworks() {
	const [networks, setNetworks] = useState<NetworksMap | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [environment, setEnvironment] = useState<NetworkEnvironment>('testnet')
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		const fetchNetworks = async () => {
			try {
				setLoading(true)

				const baseUrl = GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.BASE_URL
				const fileName =
					environment === 'mainnet'
						? GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.FILES.MAINNET_DEPLOYMENTS
						: GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.FILES.TESTNET_DEPLOYMENTS

				const response = await fetch(`${baseUrl}${fileName}`)

				if (!response.ok) {
					throw new Error(`Failed to fetch networks: ${response.status} ${response.statusText}`)
				}

				const text = await response.text()
				const lines = text.split('\n')
				const networksMap: NetworksMap = {}

				const ROUTER_PREFIX = 'CONCERO_ROUTER_PROXY_'
				const PRICE_FEED_PREFIX = 'CONCERO_PRICE_FEED_PROXY_'
				const RELAYER_LIB_PREFIX = 'CONCERO_RELAYER_LIB_PROXY_'
				const CRE_VALIDATOR_LIB_PREFIX = 'CONCERO_CRE_VALIDATOR_LIB_PROXY_'

				lines.forEach(line => {
					const trimmedLine = line.trim()
					if (!trimmedLine || trimmedLine.startsWith('#')) return

					const [key, value] = trimmedLine.split('=')
					if (!key || !value) return

					const cleanValue = value.trim().replace(/['"]/g, '')

					if (key.startsWith(ROUTER_PREFIX) && !key.includes('_ADMIN_')) {
						const networkName = key.replace(ROUTER_PREFIX, '')
						if (!networksMap[networkName]) {
							networksMap[networkName] = { routerProxy: cleanValue }
						} else {
							networksMap[networkName].routerProxy = cleanValue
						}
					} else if (key.startsWith(PRICE_FEED_PREFIX) && !key.includes('_ADMIN_')) {
						const networkName = key.replace(PRICE_FEED_PREFIX, '')
						if (!networksMap[networkName]) {
							networksMap[networkName] = { routerProxy: '', priceFeedProxy: cleanValue }
						} else {
							networksMap[networkName].priceFeedProxy = cleanValue
						}
					} else if (key.startsWith(RELAYER_LIB_PREFIX) && !key.includes('_ADMIN_')) {
						const networkName = key.replace(RELAYER_LIB_PREFIX, '')
						if (!networksMap[networkName]) {
							networksMap[networkName] = { routerProxy: '', relayerLibProxy: cleanValue }
						} else {
							networksMap[networkName].relayerLibProxy = cleanValue
						}
					} else if (key.startsWith(CRE_VALIDATOR_LIB_PREFIX) && !key.includes('_ADMIN_')) {
						const networkName = key.replace(CRE_VALIDATOR_LIB_PREFIX, '')
						if (!networksMap[networkName]) {
							networksMap[networkName] = { routerProxy: '', creValidatorLibProxy: cleanValue }
						} else {
							networksMap[networkName].creValidatorLibProxy = cleanValue
						}
					}
				})

				// Filter out entries that might have been created by secondary proxies but don't have a router proxy
				const filteredNetworks = Object.fromEntries(
					Object.entries(networksMap).filter(([_, data]) => data.routerProxy !== '')
				)

				setNetworks(filteredNetworks)
				setError(null)
			} catch (err) {
				console.error('Network fetch error:', err)
				setError(err instanceof Error ? err.message : 'An unknown error occurred')
			} finally {
				setLoading(false)
			}
		}

		fetchNetworks()
	}, [environment])

	const handleEnvironmentToggle = (isMainnet: boolean): void => {
		setEnvironment(isMainnet ? 'mainnet' : 'testnet')
	}

	if (loading) {
		return <div>Loading supported networks...</div>
	}

	if (error) {
		return <div>Error loading networks: {error}</div>
	}

	if (!networks) {
		return <div>No network data available.</div>
	}

	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 'var(--spacing-lg)',
					gap: 'var(--spacing-md)',
					flexWrap: 'wrap',
				}}
			>
				<Switch
					isOn={environment === 'mainnet'}
					onToggle={handleEnvironmentToggle}
					offLabel="Testnet"
					onLabel="Mainnet"
				/>

				<input
					type="text"
					placeholder="Search chains..."
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					style={{
						padding: '8px 12px',
						borderRadius: 'var(--border-radius)',
						border: '1px solid var(--vocs-color_tableBorder)',
						backgroundColor: 'var(--vocs-color_backgroundDark)',
						color: 'var(--vocs-color_text)',
						width: '100%',
						maxWidth: '300px',
						outline: 'none',
					}}
				/>
			</div>

			<NetworkList networks={networks} environment={environment} searchTerm={searchTerm} />
		</div>
	)
}

export default SupportedNetworks
