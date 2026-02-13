struct MessageRequest {
    uint24 dstChainSelector;
    uint64 srcBlockConfirmations;
    address feeToken;
    address relayerLib;
    address[] validatorLibs;
    bytes[] validatorConfigs;
    bytes relayerConfig;
    bytes dstChainData;
    bytes payload;
}
