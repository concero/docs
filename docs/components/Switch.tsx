interface SwitchProps {
	isOn: boolean
	onToggle: (newValue: boolean) => void
	onLabel?: string
	offLabel?: string
}

export function Switch({ isOn, onToggle, onLabel = 'On', offLabel = 'Off' }: SwitchProps) {
	return (
		<div className="switch-container">
			<span className={!isOn ? 'active-label' : 'inactive-label'}>{offLabel}</span>
			<button type="button" role="switch" aria-checked={isOn} className="switch" onClick={() => onToggle(!isOn)}>
				<span className="switch-thumb" />
			</button>
			<span className={isOn ? 'active-label' : 'inactive-label'}>{onLabel}</span>

			<style jsx>{`
				.switch-container {
					display: flex;
					align-items: center;
					gap: 10px;
				}

				.active-label {
					color: var(--vocs-color_textAccent);
					font-weight: normal;
				}

				.inactive-label {
					color: var(--vocs-foreground);
					font-weight: normal;
				}

				.switch {
					position: relative;
					display: inline-block;
					width: 48px;
					height: 24px;
					background-color: var(--accent-600);
					border-radius: 12px;
					cursor: pointer;

					border: none;
				}

				.switch-thumb {
					position: absolute;
					top: 2px;
					left: ${isOn ? '26px' : '2px'};
					width: 20px;
					height: 20px;
					background-color: var(--accent-50);
					border-radius: 50%;
					transition: left 0.2s;
					box-shadow: 0 1px 3px var(--vocs-shadow-color);
				}
			`}</style>
		</div>
	)
}

export default Switch
