import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
	startOnLoad: false,
	theme: 'dark',
	securityLevel: 'loose',
	fontFamily: 'inherit',
})

interface MermaidProps {
	chart: string
}

export function Mermaid({ chart }: MermaidProps) {
	const [svg, setSvg] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

	useEffect(() => {
		async function renderChart() {
			try {
				const { svg } = await mermaid.render(id.current, chart)
				setSvg(svg)
				setError(null)
			} catch (err) {
				console.error('Mermaid rendering failed:', err)
				setError('Failed to render diagram')
			}
		}

		renderChart()
	}, [chart])

	if (error) {
		return <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>{error}</div>
	}

	if (!svg) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					margin: '2rem 0',
					padding: '1rem',
					color: 'gray',
				}}
			>
				Loading diagram...
			</div>
		)
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				margin: '2rem 0',
				background: 'rgba(255,255,255,0.05)',
				padding: '1rem',
				borderRadius: '8px',
			}}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	)
}

export default Mermaid
