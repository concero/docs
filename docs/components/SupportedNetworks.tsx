import { useState, useEffect } from 'react'
import Switch from './Switch'
import { GITHUB_REPOSITORIES } from '../constants/config'

interface NetworkData {
	chainId: number
	chainSelector: number
}

interface NetworksMap {
	[networkName: string]: NetworkData
}

type NetworkEnvironment = 'mainnet' | 'testnet'

function formatNetworkName(name: string): string {
	return name
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, str => str.toUpperCase())
		.trim()
}

function NetworkList({ networks, environment }: { networks: NetworksMap | null; environment: NetworkEnvironment }) {
	if (!networks) {
		return null
	}

	const networkCount = Object.keys(networks).length

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
				{Object.entries(networks).map(([networkName, networkData]) => (
					<div
						key={networkName}
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
						<div style={{ color: 'gray' }}>Chain ID: {networkData.chainId}</div>
						<div style={{ color: 'gray' }}>Chain Selector: {networkData.chainSelector}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export function SupportedNetworks() {
	const [networks, setNetworks] = useState<NetworksMap | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [environment, setEnvironment] = useState<NetworkEnvironment>('testnet')

	useEffect(() => {
		const fetchNetworks = async () => {
			try {
				setLoading(true)

				const networkUrl =
					environment === 'mainnet'
						? `${GITHUB_REPOSITORIES.V2_NETWORKS.NETWORKS_URL}/mainnet.json`
						: `${GITHUB_REPOSITORIES.V2_NETWORKS.NETWORKS_URL}/testnet.json`

				const response = await fetch(networkUrl, {
					headers: {
						Accept: 'application/json',
					},
					cache: 'no-cache',
				})

				if (!response.ok) {
					throw new Error(`Failed to fetch networks: ${response.status} ${response.statusText}`)
				}

				const text = await response.text()
				let data: NetworksMap

				try {
					data = JSON.parse(text) as NetworksMap
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
	}, [environment])

	const handleEnvironmentToggle = (isMainnet: boolean): void => {
		// setEnvironment(isMainnet ? 'mainnet' : 'testnet') // we currently only support testnet. this will be enabled in the future
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
				<Switch
					isOn={environment === 'mainnet'}
					onToggle={handleEnvironmentToggle}
					offLabel="Testnet"
					onLabel="Mainnet"
				/>
			</div>

			<NetworkList networks={networks} environment={environment} />
		</div>
	)
}

export default SupportedNetworks
