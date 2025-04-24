import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";

import { vars } from "hardhat/config";
const ACCOUNT_PRIVATE_KEY = vars.get("ACCOUNT_PRIVATE_KEY");
// const PHAROS_API_KEY = vars.get("PHAROS_API_KEY");

if (!ACCOUNT_PRIVATE_KEY) {
	throw new Error(
		`ACCOUNT_PRIVATE_KEY is not set. "use npx hardhat vars set ACCOUNT_PRIVATE_KEY"`
	);
}

const config = {
	gasReporter: {
		enabled: true,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "USD",
		coinmarketcap: vars.get("COINMARKETCAP_API_KEY"),
		token: "PTT",
		excludeContracts: ["mocks/"]
	},
	solidity: {
		version: "0.8.28",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			chainId: 31337,
			gas: 12000000,
			blockGasLimit: 12000000,
			allowUnlimitedContractSize: true,
		},
		localhost: {
			url: "http://127.0.0.1:8545",
			chainId: 31337,
			timeout: 60000,
		},
		"pharos": {
			url: "https://devnet.dplabs-internal.com",
			accounts: [ACCOUNT_PRIVATE_KEY],
			chainId: 50002,
			timeout: 60000,
		},
	},

	etherscan: {
		apiKey: {},
		customChains: [
			{
				chainId: 50002,
				network: "pharos",
				urls: {
					apiURL: "",
					browserURL: "https://pharosscan.xyz",
				},
			},
		],
	},

	sourcify: {
		enabled: false,
	},
	
	mocha: {
		timeout: 100000 // 100 seconds for running tests
	},
};

export default config;