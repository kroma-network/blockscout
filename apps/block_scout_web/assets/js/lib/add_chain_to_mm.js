import 'bootstrap';

export async function addChainToMM({ btn }) {
  try {
    const ethereum = window.ethereum?.providers ? window.ethereum?.providers.find((provider) => provider.isMetaMask) : window.ethereum;
    const chainIDFromWallet = await ethereum?.request({ method: 'eth_chainId' });
    const chainIDFromInstance = getChainIdHex();

    const coinName = document.getElementById('js-coin-name').value;
    const subNetwork = document.getElementById('js-subnetwork').value;
    const jsonRPC = document.getElementById('js-json-rpc').value;

    const isInstalled = ethereum !== undefined;
    const isMobileBrowser = /Mobile|Android|iPhone/.test(navigator.userAgent) || navigator.maxTouchPoints === 5;
    const isMetaMaskAppBrowser = navigator.userAgent.includes('MetaMask');

    const blockscoutURL = location.protocol + '//' + location.host + process.env.NETWORK_PATH;

    if (!isInstalled) {
      window.open('https://metamask.io/download/');
      return;
    }

    if (isMobileBrowser && !isMetaMaskAppBrowser) {
      window.location.href = `https://metamask.app.link/dapp/${window.location.host}${location.pathname}`;
      return;
    }

    if (chainIDFromWallet !== chainIDFromInstance) {
      await ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIDFromInstance,
            chainName: subNetwork,
            nativeCurrency: {
              name: coinName,
              symbol: coinName,
              decimals: 18,
            },
            rpcUrls: [jsonRPC],
            blockExplorerUrls: [blockscoutURL],
          },
        ],
      });
    } else {
      btn.tooltip('dispose');
      btn
        .tooltip({
          title: `You're already connected to ${subNetwork}`,
          trigger: 'click',
          placement: 'bottom',
        })
        .tooltip('show');

      setTimeout(() => {
        btn.tooltip('dispose');
      }, 3000);
    }
  } catch (error) {
    console.error(error);
  }
}

function getChainIdHex() {
  const chainIDFromDOM = document.getElementById('js-chain-id').value;
  const chainIDFromInstance = parseInt(chainIDFromDOM);
  return chainIDFromInstance && `0x${chainIDFromInstance.toString(16)}`;
}
