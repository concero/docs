import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
	chart: string
}

type ThemeMode = 'light' | 'dark'

function getThemeMode(): ThemeMode {
	if (typeof document === 'undefined') {
		return 'light'
	}

	const root = document.documentElement
	const dataTheme = root.getAttribute('data-theme')
	if (dataTheme === 'dark' || dataTheme === 'light') {
		return dataTheme
	}

	if (root.classList.contains('dark')) return 'dark'
	if (root.classList.contains('light')) return 'light'

	if (typeof window !== 'undefined' && window.matchMedia) {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}

	return 'light'
}

function readCssVar(name: string, fallback: string): string {
	if (typeof window === 'undefined') return fallback
	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
	return value || fallback
}

function getThemeVariables(theme: ThemeMode) {
	const isDark = theme === 'dark'
	const background = readCssVar('--vocs-color_background', isDark ? '#0b0b0b' : '#ffffff')
	const surface = readCssVar('--vocs-color_backgroundDark', isDark ? '#111827' : '#f8fafc')
	const border = readCssVar('--vocs-color_tableBorder', isDark ? '#1f2937' : '#e5e7eb')
	const text = readCssVar('--vocs-color_text', isDark ? '#f9fafb' : '#111827')
	const accent = readCssVar('--vocs-color_backgroundAccent', isDark ? '#210b5f' : '#f3f1fe')

	return {
		background,
		primaryColor: surface,
		primaryTextColor: text,
		primaryBorderColor: border,
		lineColor: border,
		secondaryColor: accent,
		secondaryTextColor: text,
		tertiaryColor: background,
		tertiaryTextColor: text,
		noteBkgColor: surface,
		noteTextColor: text,
		clusterBkg: background,
		clusterBorder: border,
	}
}

export function Mermaid({ chart }: MermaidProps) {
	const [svg, setSvg] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [themeMode, setThemeMode] = useState<ThemeMode>(getThemeMode)
	const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

	useEffect(() => {
		if (typeof document === 'undefined') return

		const updateTheme = () => setThemeMode(getThemeMode())
		updateTheme()

		const observer = new MutationObserver(updateTheme)
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme'],
		})

		const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
		const handleMediaChange = () => updateTheme()

		if (media?.addEventListener) {
			media.addEventListener('change', handleMediaChange)
		} else if (media?.addListener) {
			media.addListener(handleMediaChange)
		}

		return () => {
			observer.disconnect()
			if (media?.removeEventListener) {
				media.removeEventListener('change', handleMediaChange)
			} else if (media?.removeListener) {
				media.removeListener(handleMediaChange)
			}
		}
	}, [])

	useEffect(() => {
		let isActive = true

		async function renderChart() {
			try {
				mermaid.initialize({
					startOnLoad: false,
					theme: themeMode === 'dark' ? 'dark' : 'default',
					securityLevel: 'loose',
					fontFamily: 'inherit',
					themeVariables: getThemeVariables(themeMode),
				})

				const { svg } = await mermaid.render(id.current, chart)
				if (!isActive) return
				setSvg(svg)
				setError(null)
			} catch (err) {
				console.error('Mermaid rendering failed:', err)
				if (isActive) {
					setError('Failed to render diagram')
				}
			}
		}

		renderChart()
		return () => {
			isActive = false
		}
	}, [chart, themeMode])

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
