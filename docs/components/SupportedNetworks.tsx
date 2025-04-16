import { useState, useEffect } from 'react'
import Switch from './Switch'
import { GITHUB_REPOSITORIES } from '../constants/config'

interface NetworksData {
	mainnet: Record<string, string>
	testnet: Record<string, string>
}

type NetworkEnvironment = 'mainnet' | 'testnet'

function formatNetworkName(name: string): string {
	return name
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, str => str.toUpperCase())
		.trim()
}

function NetworkList({ networks, environment }: { networks: NetworksData; environment: NetworkEnvironment }) {
	const currentNetworks = networks[environment]
	const networkCount = Object.keys(currentNetworks).length

	return (
		<div>
			<h3>
				{environment === 'mainnet' ? 'Mainnet' : 'Testnet'} Networks ({networkCount} chains)
			</h3>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
					gap: 'var(--spacing-md)',
					marginTop: 'var(--spacing-lg)',
				}}
			>
				{Object.entries(currentNetworks).map(([chainId, networkName]) => (
					<div
						key={chainId}
						style={{
							padding: 'var(--spacing-md)',
							borderRadius: 'var(--border-radius)',
							backgroundColor: 'var(--vocs-color_backgroundDark)',
							fontWeight: '300',
							borderColor: 'var(--vocs-color_tableBorder)',
							borderStyle: 'solid',
							borderWidth: '1px',
						}}
					>
						{formatNetworkName(networkName)}

						<div style={{ color: 'gray' }}>Chain ID: {chainId}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export function SupportedNetworks() {
	const [networks, setNetworks] = useState<NetworksData | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [environment, setEnvironment] = useState<NetworkEnvironment>('mainnet')

	useEffect(() => {
		const fetchNetworks = async () => {
			try {
				setLoading(true)

				const response = await fetch(GITHUB_REPOSITORIES.RPCS.SUPPORTED_NETWORKS_URL, {
					headers: {
						Accept: 'application/json',
					},
					cache: 'no-cache',
				})

				if (!response.ok) {
					throw new Error(`Failed to fetch networks: ${response.status} ${response.statusText}`)
				}

				const text = await response.text()
				let data: NetworksData

				try {
					data = JSON.parse(text) as NetworksData
				} catch (parseError) {
					throw new Error(`Failed to parse JSON response: ${text.substring(0, 100)}...`)
				}

				setNetworks(data)
				setError(null)
			} catch (err) {
				console.error('Network fetch error:', err)
				setError(err instanceof Error ? err.message : 'An unknown error occurred')
			} finally {
				setLoading(false)
			}
		}

		fetchNetworks()
	}, [])

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
					justifyContent: 'flex-start',
					marginBottom: 'var(--spacing-lg)',
				}}
			>
				<Switch isOn={environment === 'mainnet'} onToggle={handleEnvironmentToggle} offLabel="Testnet" onLabel="Mainnet" />
			</div>

			<NetworkList networks={networks} environment={environment} />
		</div>
	)
}

export default SupportedNetworks
