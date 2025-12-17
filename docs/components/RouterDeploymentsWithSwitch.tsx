import { useState } from 'react'
import RouterProxyAddresses from './RouterProxyAddresses'
import Switch from './Switch'
import { NetworkEnvironment } from '../constants/config'

export function RouterDeploymentsWithSwitch({ deploymentKey }: { deploymentKey: string }) {
	const [environment, setEnvironment] = useState<NetworkEnvironment>('testnet')

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
				<Switch
					isOn={environment === 'mainnet'}
					onToggle={value => setEnvironment(value ? 'mainnet' : 'testnet')}
					offLabel="Testnet"
					onLabel="Mainnet"
				/>
			</div>

			<RouterProxyAddresses environment={environment} deploymentKey={deploymentKey} />
		</div>
	)
}

export default RouterDeploymentsWithSwitch
