bytes messageReceipt;

// Encoded by MessageCodec.toMessageReceiptBytes(...)
// [0]         : version (uint8)
// [1:4]       : srcChainSelector (uint24)
// [4:7]       : dstChainSelector (uint24)
// [7:39]      : nonce (bytes32)
// [39:42]     : srcChainData length (uint24)
// [42:..]     : srcChainData = sender (address) + srcBlockConfirmations (uint64)
// [...]       : dstChainData length + dstChainData
// [...]       : relayerConfig length + relayerConfig
// [...]       : validatorConfigs (flattened bytes[])
// [...]       : internalValidatorConfigs (flattened bytes[])
// [...]       : payload length + payload
