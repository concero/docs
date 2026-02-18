import { useState, useEffect } from 'react'
import { GITHUB_REPOSITORIES } from '../constants/config'

interface NetworkEntry {
	name: string
	chainSelector: number
	finalityTagEnabled?: boolean
	finalityConfirmations?: number
	minBlockConfirmations?: number
}

interface FinalityRow {
	name: string
	chainSelector: string
	finalityMethod: string
	minBlockConfirmations: number
}

function parseFinalityMethod(entry: NetworkEntry): string {
	if (entry.finalityTagEnabled === true) {
		return 'finalized'
	}
	if (typeof entry.finalityConfirmations === 'number' && entry.finalityConfirmations > 0) {
		return String(entry.finalityConfirmations)
	}
	return 'none'
}

function parseRows(data: unknown): FinalityRow[] {
	if (typeof data !== 'object' || data === null || Array.isArray(data)) return []

	const rows: FinalityRow[] = []

	for (const item of Object.values(data as Record<string, unknown>)) {
		if (typeof item !== 'object' || item === null) continue

		const entry = item as Record<string, unknown>
		const name = typeof entry.name === 'string' ? entry.name.trim() : null
		if (!name) continue

		const chainSelector = entry.chainSelector != null ? String(entry.chainSelector) : '—'
		const minBlockConfirmations = typeof entry.minBlockConfirmations === 'number' ? entry.minBlockConfirmations : 1

		rows.push({
			name,
			chainSelector,
			finalityMethod: parseFinalityMethod(entry as unknown as NetworkEntry),
			minBlockConfirmations,
		})
	}

	return rows.filter(row => row.finalityMethod !== 'none').sort((a, b) => a.name.localeCompare(b.name))
}

export function FinalityTable() {
	const [rows, setRows] = useState<FinalityRow[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let isActive = true
		const controller = new AbortController()

		const fetchData = async () => {
			try {
				const response = await fetch(GITHUB_REPOSITORIES.V2_NETWORKS.MAINNET_NETWORKS_URL, {
					signal: controller.signal,
				})

				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
				}

				const data = await response.json()

				if (!isActive) return

				setRows(parseRows(data))
				setError(null)
			} catch (err) {
				if (err instanceof DOMException && err.name === 'AbortError') return
				if (isActive) {
					setError(err instanceof Error ? err.message : 'An unknown error occurred')
				}
			} finally {
				if (isActive) setLoading(false)
			}
		}

		fetchData()

		return () => {
			isActive = false
			controller.abort()
		}
	}, [])

	if (loading) {
		return <div style={{ color: 'gray', padding: '8px 0' }}>Loading finality data...</div>
	}

	if (error) {
		return <div style={{ color: '#dc2626', padding: '8px 0' }}>Error loading finality data: {error}</div>
	}

	if (rows.length === 0) {
		return <div style={{ color: 'gray', padding: '8px 0' }}>No chain data available.</div>
	}

	return (
		<div style={{ overflowX: 'auto' }}>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr>
						{[
							'SRC Blockchain',
							'Chain selector',
							'Finality (tag/finalityConfirmations)',
							'minBlockConfirmations',
						].map(col => (
							<th
								key={col}
								style={{
									textAlign: 'left',
									padding: '8px 12px',
									borderBottom: '1px solid var(--vocs-color_tableBorder)',
									fontSize: '0.88rem',
									fontWeight: 600,
									color: 'var(--vocs-color_text)',
									whiteSpace: 'nowrap',
								}}
							>
								{col}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map(row => (
						<tr key={row.name}>
							<td style={cellStyle}>{row.name}</td>
							<td style={cellStyle}>{row.chainSelector}</td>
							<td style={{ ...cellStyle, fontFamily: 'monospace' }}>{row.finalityMethod}</td>
							<td style={cellStyle}>{row.minBlockConfirmations}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

const cellStyle: React.CSSProperties = {
	padding: '8px 12px',
	borderBottom: '1px solid var(--vocs-color_tableBorder)',
	fontSize: '0.9rem',
	color: 'var(--vocs-color_text)',
}
