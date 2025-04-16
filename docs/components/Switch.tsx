interface SwitchProps {
	isOn: boolean
	onToggle: (newValue: boolean) => void
	onLabel?: string
	offLabel?: string
}

export function Switch({ isOn, onToggle, onLabel = 'On', offLabel = 'Off' }: SwitchProps) {
	return (
		<div className="switch-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
			<span
				className={!isOn ? 'active-label' : 'inactive-label'}
				style={{
					color: !isOn ? 'var(--vocs-primary-600)' : 'inherit',
					fontWeight: 'normal',
				}}
			>
				{offLabel}
			</span>
			<button
				type="button"
				role="switch"
				aria-checked={isOn}
				className="switch"
				onClick={() => onToggle(!isOn)}
				style={{
					position: 'relative',
					display: 'inline-block',
					width: '48px',
					height: '24px',
					backgroundColor: isOn ? 'var(--vocs-primary-500)' : 'var(--vocs-gray-300)',
					borderRadius: '12px',
					cursor: 'pointer',
					transition: 'background-color 0.2s',
					border: 'none',
				}}
			>
				<span
					className="switch-thumb"
					style={{
						position: 'absolute',
						top: '2px',
						left: isOn ? '26px' : '2px',
						width: '20px',
						height: '20px',
						backgroundColor: 'white',
						borderRadius: '50%',
						transition: 'left 0.2s',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
					}}
				/>
			</button>
			<span
				className={isOn ? 'active-label' : 'inactive-label'}
				style={{
					color: isOn ? 'var(--vocs-primary-600)' : 'inherit',
					fontWeight: 'normal',
				}}
			>
				{onLabel}
			</span>
		</div>
	)
}

export default Switch
