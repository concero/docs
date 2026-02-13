import { useState, useEffect, useRef } from 'react'
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
type DetailsStatus = 'idle' | 'loading' | 'ready' | 'error'

interface BlockExplorer {
	name?: string
	url?: string
	apiUrl?: string
}

interface NativeCurrency {
	name?: string
	symbol?: string
	decimals?: number
}

interface NetworkDetails {
	name?: string
	chainId?: string | number
	chainSelector?: string | number
	rpcUrls?: string[]
	blockExplorers?: BlockExplorer[]
	nativeCurrency?: NativeCurrency
}

interface InfoTableRow {
	id: string
	label: string
	value: JSX.Element
}

type NetworkDetailsLookup = Record<string, NetworkDetails>
type RpcBySelectorMap = Record<string, string[]>

function parseEnvironmentTag(value: string | null): NetworkEnvironment | null {
	if (!value) {
		return null
	}

	const normalizedValue = value.trim().toLowerCase()

	if (normalizedValue === 'mainnet' || normalizedValue === 'testnet') {
		return normalizedValue
	}

	return null
}

function getEnvironmentFromLocation(location: Location): NetworkEnvironment | null {
	const url = new URL(location.href)
	const searchTag = parseEnvironmentTag(url.searchParams.get('tag'))

	if (searchTag) {
		return searchTag
	}

	const searchEnvironment = parseEnvironmentTag(url.searchParams.get('environment'))

	if (searchEnvironment) {
		return searchEnvironment
	}

	const searchNetwork = parseEnvironmentTag(url.searchParams.get('network'))

	if (searchNetwork) {
		return searchNetwork
	}

	const hashTag = parseEnvironmentTag(url.hash.replace(/^#/, ''))

	if (hashTag) {
		return hashTag
	}

	return null
}

function getInitialEnvironment(): NetworkEnvironment {
	if (typeof window === 'undefined') {
		return 'mainnet'
	}

	return getEnvironmentFromLocation(window.location) ?? 'mainnet'
}

function formatNetworkName(name: string): string {
	return name
		.replace(/_PROXY$/, '')
		.toLowerCase()
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

function normalizeNetworkKey(value: string): string {
	return value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toStringValue(value: unknown): string | null {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value)
	}

	if (typeof value === 'string') {
		const trimmed = value.trim()
		return trimmed.length > 0 ? trimmed : null
	}

	return null
}

function toStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return []
	}

	return value
		.filter(item => typeof item === 'string')
		.map(item => item.trim())
		.filter(item => item.length > 0)
}

function parseBlockExplorers(value: unknown): BlockExplorer[] {
	if (!Array.isArray(value)) {
		return []
	}

	return value
		.map(item => {
			if (!isRecord(item)) {
				return null
			}

			const name = toStringValue(item.name)
			const url = toStringValue(item.url)
			const apiUrl = toStringValue(item.apiUrl)

			if (!name && !url && !apiUrl) {
				return null
			}

			return {
				name: name ?? undefined,
				url: url ?? undefined,
				apiUrl: apiUrl ?? undefined,
			}
		})
		.filter((item): item is BlockExplorer => item !== null)
}

function parseNativeCurrency(value: unknown): NativeCurrency | undefined {
	if (!isRecord(value)) {
		return undefined
	}

	const name = toStringValue(value.name)
	const symbol = toStringValue(value.symbol)
	const decimals = typeof value.decimals === 'number' && Number.isFinite(value.decimals) ? value.decimals : undefined

	if (!name && !symbol && decimals === undefined) {
		return undefined
	}

	return {
		name: name ?? undefined,
		symbol: symbol ?? undefined,
		decimals,
	}
}

function parseNetworkDetails(value: unknown): NetworkDetails {
	if (!isRecord(value)) {
		return {}
	}

	return {
		name: toStringValue(value.name) ?? undefined,
		chainId: toStringValue(value.chainId) ?? undefined,
		chainSelector: toStringValue(value.chainSelector) ?? undefined,
		rpcUrls: toStringArray(value.rpcUrls),
		blockExplorers: parseBlockExplorers(value.blockExplorers),
		nativeCurrency: parseNativeCurrency(value.nativeCurrency),
	}
}

function buildNetworkDetailsLookup(raw: unknown): NetworkDetailsLookup {
	if (!isRecord(raw)) {
		return {}
	}

	const lookup: NetworkDetailsLookup = {}

	for (const [key, value] of Object.entries(raw)) {
		const details = parseNetworkDetails(value)
		const normalizedKey = normalizeNetworkKey(key)

		if (normalizedKey) {
			lookup[normalizedKey] = details
		}

		if (details.name) {
			const normalizedName = normalizeNetworkKey(details.name)
			if (normalizedName) {
				lookup[normalizedName] = details
			}
		}
	}

	return lookup
}

function buildRpcsBySelector(raw: unknown): RpcBySelectorMap {
	if (!isRecord(raw)) {
		return {}
	}

	const rpcsBySelector: RpcBySelectorMap = {}

	for (const value of Object.values(raw)) {
		if (!isRecord(value)) {
			continue
		}

		const selector = toStringValue(value.chainSelector)
		if (!selector) {
			continue
		}

		const rpcUrls = toStringArray(value.rpcUrls)
		if (!rpcsBySelector[selector]) {
			rpcsBySelector[selector] = []
		}

		for (const rpcUrl of rpcUrls) {
			if (!rpcsBySelector[selector].includes(rpcUrl)) {
				rpcsBySelector[selector].push(rpcUrl)
			}
		}
	}

	return rpcsBySelector
}

function formatNativeCurrency(nativeCurrency?: NativeCurrency): string | null {
	if (!nativeCurrency) {
		return null
	}

	const name = nativeCurrency.name?.trim()
	const symbol = nativeCurrency.symbol?.trim()
	const hasDecimals = typeof nativeCurrency.decimals === 'number' && Number.isFinite(nativeCurrency.decimals)

	if (!name && !symbol && !hasDecimals) {
		return null
	}

	let value = ''

	if (name && symbol) {
		value = `${name} (${symbol})`
	} else if (name) {
		value = name
	} else if (symbol) {
		value = symbol
	}

	if (hasDecimals) {
		value = value ? `${value}, decimals: ${nativeCurrency.decimals}` : `Decimals: ${nativeCurrency.decimals}`
	}

	return value || null
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

function CopyableMonoValue({ text }: { text: string }) {
	return (
		<span
			style={{
				fontFamily: 'monospace',
				wordBreak: 'break-all',
				display: 'inline-flex',
				alignItems: 'center',
			}}
		>
			{text}
			<CopyButton text={text} />
		</span>
	)
}

function SectionTable({ rows }: { rows: InfoTableRow[] }) {
	return (
		<div style={{ overflowX: 'auto' }}>
			<table
				style={{
					width: '100%',
					borderCollapse: 'collapse',
				}}
			>
				<tbody>
					{rows.map((row, index) => {
						const isLastRow = index === rows.length - 1

						return (
							<tr key={row.id}>
								<th
									scope="row"
									style={{
										textAlign: 'left',
										padding: '8px 0',
										verticalAlign: 'top',
										fontSize: '0.88rem',
										fontWeight: 500,
										color: 'var(--vocs-color_text)',
										borderBottom: isLastRow ? 'none' : '1px solid var(--vocs-color_tableBorder)',
										width: '180px',
									}}
								>
									{row.label}
								</th>
								<td
									style={{
										padding: '8px 0',
										fontSize: '0.9rem',
										color: 'var(--vocs-color_text)',
										borderBottom: isLastRow ? 'none' : '1px solid var(--vocs-color_tableBorder)',
										lineHeight: 1.45,
									}}
								>
									{row.value}
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

function NetworkCard({
	networkName,
	networkData,
	networkDetailsLookup,
	rpcsBySelector,
	detailsStatus,
	detailsError,
}: {
	networkName: string
	networkData: NetworkData
	networkDetailsLookup: NetworkDetailsLookup
	rpcsBySelector: RpcBySelectorMap
	detailsStatus: DetailsStatus
	detailsError: string | null
}) {
	const [isDetailsOpen, setIsDetailsOpen] = useState(false)
	const displayNetworkName = formatNetworkName(networkName)
	const details = networkDetailsLookup[normalizeNetworkKey(networkName)]
	const chainId = details ? toStringValue(details.chainId) : null
	const chainSelector = details ? toStringValue(details.chainSelector) : null
	const rpcUrls = chainSelector ? (rpcsBySelector[chainSelector] ?? []) : []
	const blockExplorers = details?.blockExplorers ?? []
	const nativeCurrencyText = formatNativeCurrency(details?.nativeCurrency)
	const loadingDetails = detailsStatus === 'idle' || detailsStatus === 'loading'

	const deploymentRows: InfoTableRow[] = [
		{
			id: 'router',
			label: 'Router',
			value: <CopyableMonoValue text={networkData.routerProxy} />,
		},
	]

	if (networkData.priceFeedProxy) {
		deploymentRows.push({
			id: 'price-feed',
			label: 'Price Feed',
			value: <CopyableMonoValue text={networkData.priceFeedProxy} />,
		})
	}

	if (networkData.relayerLibProxy) {
		deploymentRows.push({
			id: 'relayer-lib',
			label: 'Relayer Lib',
			value: <CopyableMonoValue text={networkData.relayerLibProxy} />,
		})
	}

	if (networkData.creValidatorLibProxy) {
		deploymentRows.push({
			id: 'cre-validator-lib',
			label: 'CRE Validator Lib',
			value: <CopyableMonoValue text={networkData.creValidatorLibProxy} />,
		})
	}

	let networkDetailsRows: InfoTableRow[]

	if (loadingDetails) {
		networkDetailsRows = [
			{
				id: 'loading',
				label: 'Status',
				value: <span style={{ color: 'gray' }}>Loading network details...</span>,
			},
		]
	} else if (detailsStatus === 'error') {
		networkDetailsRows = [
			{
				id: 'error',
				label: 'Status',
				value: (
					<span style={{ color: '#dc2626' }}>
						Failed to load network details{detailsError ? `: ${detailsError}` : '.'}
					</span>
				),
			},
		]
	} else if (!details) {
		networkDetailsRows = [
			{
				id: 'missing',
				label: 'Status',
				value: <span style={{ color: 'gray' }}>No network details found.</span>,
			},
		]
	} else {
		networkDetailsRows = [
			{
				id: 'chain-id',
				label: 'Chain ID',
				value: chainId ? (
					<CopyableMonoValue text={chainId} />
				) : (
					<span style={{ color: 'gray' }}>Not available</span>
				),
			},
			{
				id: 'chain-selector',
				label: 'Chain Selector',
				value: chainSelector ? (
					<CopyableMonoValue text={chainSelector} />
				) : (
					<span style={{ color: 'gray' }}>Not available</span>
				),
			},
			{
				id: 'rpcs',
				label: 'RPCs',
				value:
					rpcUrls.length > 0 ? (
						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							{rpcUrls.map(rpcUrl => (
								<CopyableMonoValue key={rpcUrl} text={rpcUrl} />
							))}
						</div>
					) : (
						<span style={{ color: 'gray' }}>No RPC endpoints found.</span>
					),
			},
			{
				id: 'block-explorers',
				label: 'Block Explorers',
				value:
					blockExplorers.length > 0 ? (
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
							{blockExplorers.map((explorer, index) => {
								const url = explorer.url?.trim()
								const label = explorer.name?.trim() || url || `Explorer ${index + 1}`

								if (!url) {
									return <span key={`${label}-${index}`}>{label}</span>
								}

								return (
									<a
										key={`${label}-${index}`}
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										style={{ color: 'var(--vocs-color_textAccent)' }}
									>
										{label}
									</a>
								)
							})}
						</div>
					) : (
						<span style={{ color: 'gray' }}>Not available</span>
					),
			},
			{
				id: 'native-currency',
				label: 'Native Currency',
				value: <span>{nativeCurrencyText ?? 'Not available'}</span>,
			},
		]
	}

	return (
		<div
			style={{
				paddingBottom: 'var(--spacing-lg)',
				borderBottom: '1px solid var(--vocs-color_tableBorder)',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					gap: '6px',
				}}
			>
				<div
					style={{
						fontWeight: 600,
						fontSize: '1.2rem',
						color: 'var(--vocs-color_text)',
					}}
				>
					{displayNetworkName}
				</div>

				<button
					type="button"
					onClick={() => setIsDetailsOpen(previous => !previous)}
					aria-expanded={isDetailsOpen}
					aria-label={isDetailsOpen ? 'Hide network details' : 'Show network details'}
					style={{
						padding: 0,
						border: 'none',
						background: 'none',
						display: 'inline-flex',
						alignItems: 'center',
						cursor: 'pointer',
						color: 'var(--vocs-color_text)',
						opacity: 0.9,
					}}
				>
					<span
						style={{
							display: 'inline-flex',
							transition: 'transform 0.24s ease',
							transform: isDetailsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
						}}
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.25"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</span>
				</button>
			</div>

			<div
				style={{
					display: 'grid',
					gridTemplateRows: isDetailsOpen ? '1fr' : '0fr',
					transition: 'grid-template-rows 0.28s ease, opacity 0.28s ease, margin-top 0.28s ease',
					opacity: isDetailsOpen ? 1 : 0,
					marginTop: isDetailsOpen ? 'var(--spacing-md)' : '0',
				}}
			>
				<div
					style={{
						overflow: 'hidden',
						transform: isDetailsOpen ? 'translateY(0)' : 'translateY(-8px)',
						transition: 'transform 0.28s ease',
					}}
				>
					<div
						style={{
							fontSize: '0.92rem',
							fontWeight: 600,
							color: 'var(--vocs-color_text)',
							marginBottom: 'var(--spacing-sm)',
						}}
					>
						Network Details
					</div>
					<SectionTable rows={networkDetailsRows} />
					<div
						style={{
							margin: 'var(--spacing-md) 0 0',
							borderBottom: '1px solid var(--vocs-color_tableBorder)',
						}}
					/>
				</div>
			</div>

			<SectionTable rows={deploymentRows} />
		</div>
	)
}

function NetworkList({
	networks,
	environment,
	searchTerm,
	networkDetailsLookup,
	rpcsBySelector,
	detailsStatus,
	detailsError,
}: {
	networks: NetworksMap | null
	environment: NetworkEnvironment
	searchTerm: string
	networkDetailsLookup: NetworkDetailsLookup
	rpcsBySelector: RpcBySelectorMap
	detailsStatus: DetailsStatus
	detailsError: string | null
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
					<NetworkCard
						key={networkName}
						networkName={networkName}
						networkData={networkData}
						networkDetailsLookup={networkDetailsLookup}
						rpcsBySelector={rpcsBySelector}
						detailsStatus={detailsStatus}
						detailsError={detailsError}
					/>
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
	const [networkDetailsLookup, setNetworkDetailsLookup] = useState<NetworkDetailsLookup>({})
	const [rpcsBySelector, setRpcsBySelector] = useState<RpcBySelectorMap>({})
	const [detailsStatus, setDetailsStatus] = useState<DetailsStatus>('idle')
	const [detailsError, setDetailsError] = useState<string | null>(null)
	const [environment, setEnvironment] = useState<NetworkEnvironment>(getInitialEnvironment)
	const [searchTerm, setSearchTerm] = useState('')
	const networksCacheRef = useRef<Partial<Record<NetworkEnvironment, NetworksMap>>>({})
	const networkDetailsCacheRef = useRef<Partial<Record<NetworkEnvironment, NetworkDetailsLookup>>>({})
	const rpcsBySelectorCacheRef = useRef<RpcBySelectorMap | null>(null)

	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		const syncEnvironmentFromUrl = () => {
			const environmentFromLocation = getEnvironmentFromLocation(window.location)
			if (!environmentFromLocation) {
				return
			}

			setEnvironment(currentEnvironment =>
				currentEnvironment === environmentFromLocation ? currentEnvironment : environmentFromLocation,
			)
		}

		syncEnvironmentFromUrl()
		window.addEventListener('popstate', syncEnvironmentFromUrl)

		return () => {
			window.removeEventListener('popstate', syncEnvironmentFromUrl)
		}
	}, [])

	useEffect(() => {
		let isActive = true
		const controller = new AbortController()

		const fetchNetworks = async () => {
			try {
				const cachedNetworks = networksCacheRef.current[environment]
				if (cachedNetworks) {
					setNetworks(cachedNetworks)
					setError(null)
					setLoading(false)
					return
				}

				setLoading(true)

				const baseUrl = GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.BASE_URL
				const fileName =
					environment === 'mainnet'
						? GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.FILES.MAINNET_DEPLOYMENTS
						: GITHUB_REPOSITORIES.MESSAGING_CONTRACTS_V2.FILES.TESTNET_DEPLOYMENTS

				const response = await fetch(`${baseUrl}${fileName}`, { signal: controller.signal })

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

				const filteredNetworks = Object.fromEntries(
					Object.entries(networksMap).filter(([_, data]) => data.routerProxy !== ''),
				)

				if (!isActive) return

				setNetworks(filteredNetworks)
				networksCacheRef.current[environment] = filteredNetworks
				setError(null)
			} catch (err) {
				if (err instanceof DOMException && err.name === 'AbortError') {
					return
				}
				console.error('Network fetch error:', err)
				if (isActive) {
					setError(err instanceof Error ? err.message : 'An unknown error occurred')
				}
			} finally {
				if (isActive) {
					setLoading(false)
				}
			}
		}

		fetchNetworks()
		return () => {
			isActive = false
			controller.abort()
		}
	}, [environment])

	useEffect(() => {
		let isActive = true
		const controller = new AbortController()

		const fetchWithError = async (url: string): Promise<Response> => {
			const response = await fetch(url, { signal: controller.signal })
			if (!response.ok) {
				throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
			}
			return response
		}

		const fetchNetworkDetails = async () => {
			try {
				const cachedDetails = networkDetailsCacheRef.current[environment]
				const cachedRpcsBySelector = rpcsBySelectorCacheRef.current

				if (cachedDetails && cachedRpcsBySelector) {
					setNetworkDetailsLookup(cachedDetails)
					setRpcsBySelector(cachedRpcsBySelector)
					setDetailsStatus('ready')
					setDetailsError(null)
					return
				}

				setDetailsStatus('loading')

				const detailsPromise = cachedDetails
					? Promise.resolve(cachedDetails)
					: fetchWithError(
							environment === 'mainnet'
								? GITHUB_REPOSITORIES.V2_NETWORKS.MAINNET_NETWORKS_URL
								: GITHUB_REPOSITORIES.V2_NETWORKS.TESTNET_NETWORKS_URL,
						)
							.then(response => response.json())
							.then(data => buildNetworkDetailsLookup(data))

				const rpcsPromise = cachedRpcsBySelector
					? Promise.resolve(cachedRpcsBySelector)
					: fetchWithError(GITHUB_REPOSITORIES.RPCS.MAINNET_RPCS_URL)
							.then(response => response.json())
							.then(data => buildRpcsBySelector(data))

				const [details, rpcs] = await Promise.all([detailsPromise, rpcsPromise])
				if (!isActive) {
					return
				}

				networkDetailsCacheRef.current[environment] = details
				rpcsBySelectorCacheRef.current = rpcs
				setNetworkDetailsLookup(details)
				setRpcsBySelector(rpcs)
				setDetailsStatus('ready')
				setDetailsError(null)
			} catch (err) {
				if (err instanceof DOMException && err.name === 'AbortError') {
					return
				}
				console.error('Network details fetch error:', err)
				if (!isActive) {
					return
				}
				setDetailsStatus('error')
				setDetailsError(err instanceof Error ? err.message : 'An unknown error occurred')
				setNetworkDetailsLookup(networkDetailsCacheRef.current[environment] ?? {})
				setRpcsBySelector(rpcsBySelectorCacheRef.current ?? {})
			}
		}

		fetchNetworkDetails()
		return () => {
			isActive = false
			controller.abort()
		}
	}, [environment])

	const setUrlEnvironmentTag = (selected: NetworkEnvironment): void => {
		if (typeof window === 'undefined') {
			return
		}

		const url = new URL(window.location.href)
		const currentTag = parseEnvironmentTag(url.searchParams.get('tag'))

		if (currentTag === selected) {
			return
		}

		url.searchParams.set('tag', selected)
		window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
	}

	useEffect(() => {
		setUrlEnvironmentTag(environment)
	}, [environment])

	const handleEnvironmentSelect = (selected: NetworkEnvironment): void => {
		setEnvironment(selected)
	}

	let content: JSX.Element
	if (loading) {
		content = <div>Loading supported networks...</div>
	} else if (error) {
		content = <div>Error loading networks: {error}</div>
	} else if (!networks) {
		content = <div>No network data available.</div>
	} else {
		content = (
			<NetworkList
				networks={networks}
				environment={environment}
				searchTerm={searchTerm}
				networkDetailsLookup={networkDetailsLookup}
				rpcsBySelector={rpcsBySelector}
				detailsStatus={detailsStatus}
				detailsError={detailsError}
			/>
		)
	}

	return (
		<div>
			<span id="mainnet" />
			<span id="testnet" />
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
				<div className="networkToggle" role="group" aria-label="Network environment">
					<button
						type="button"
						className={`networkToggleButton ${environment === 'mainnet' ? 'isActive' : ''}`}
						onClick={() => handleEnvironmentSelect('mainnet')}
						aria-pressed={environment === 'mainnet'}
					>
						Mainnet
					</button>
					<button
						type="button"
						className={`networkToggleButton ${environment === 'testnet' ? 'isActive' : ''}`}
						onClick={() => handleEnvironmentSelect('testnet')}
						aria-pressed={environment === 'testnet'}
					>
						Testnet
					</button>
				</div>

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

			{content}

			<style jsx>{`
				.networkToggle {
					align-items: center;
					background: var(--vocs-color_backgroundDark);
					border: 1px solid var(--vocs-color_tableBorder);
					border-radius: var(--border-radius);
					display: inline-flex;
					flex-shrink: 0;
					gap: 4px;
					padding: 4px;
					box-shadow: inset 0 1px 1px var(--vocs-shadow-color);
				}

				.networkToggleButton {
					background: transparent;
					border: 0;
					border-radius: var(--border-radius);
					color: var(--vocs-color_text);
					cursor: pointer;
					font-size: 13px;
					font-weight: 600;
					letter-spacing: 0.01em;
					min-width: 96px;
					padding: 6px 14px;
					opacity: 0.8;
					transition:
						background-color 0.2s ease,
						color 0.2s ease,
						box-shadow 0.2s ease,
						transform 0.15s ease,
						opacity 0.2s ease;
				}

				.networkToggleButton:hover {
					opacity: 1;
					background: var(--vocs-color_backgroundAccentHover);
				}

				.networkToggleButton:active {
					transform: translateY(1px);
				}

				.networkToggleButton.isActive {
					opacity: 1;
					background: var(--vocs-color_backgroundAccent);
					color: var(--vocs-color_textAccent);
					box-shadow: 0 1px 2px var(--vocs-shadow-color);
				}

				.networkToggleButton:focus-visible {
					outline: 2px solid var(--vocs-color_textAccent);
					outline-offset: 2px;
				}
			`}</style>
		</div>
	)
}

export default SupportedNetworks
