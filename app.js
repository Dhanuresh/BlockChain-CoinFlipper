let web3;
let userAccount;
let userBalance;

const connectWalletButton = document.getElementById('connectWallet');
const walletAddressText = document.getElementById('walletAddress');
const balanceText = document.getElementById('balance');
const betAmountInput = document.getElementById('betAmount');
const flipCoinButton = document.getElementById('flipCoin');
const resultText = document.getElementById('result');

const initialize = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            userAccount = (await web3.eth.getAccounts())[0];
            walletAddressText.innerText = `Connected: ${userAccount}`;
            updateBalance();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
};

const updateBalance = async () => {
    userBalance = await web3.eth.getBalance(userAccount);
    balanceText.innerText = `Balance: ${web3.utils.fromWei(userBalance, 'ether')} ETH`;
};

connectWalletButton.addEventListener('click', initialize);

flipCoinButton.addEventListener('click', async () => {
    const betAmount = web3.utils.toWei(betAmountInput.value, 'ether');
    const outcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const winningAmount = web3.utils.toBN(betAmount).muln(2);

    resultText.innerText = `Result: ${outcome}`;

    if (outcome === 'Heads') {
        userBalance = web3.utils.toBN(userBalance).add(winningAmount).toString();
        resultText.innerText += ` - You win ${web3.utils.fromWei(winningAmount.toString(), 'ether')} ETH!`;
    } else {
        userBalance = web3.utils.toBN(userBalance).sub(web3.utils.toBN(betAmount)).toString();
        resultText.innerText += ` - You lose ${web3.utils.fromWei(betAmount.toString(), 'ether')} ETH.`;
    }

    updateBalanceDisplay();
});

// Mock free coins function for testing
document.getElementById('getFreeCoins').addEventListener('click', () => {
    const freeCoins = web3.utils.toWei('50', 'ether');
    userBalance = web3.utils.toBN(userBalance).add(web3.utils.toBN(freeCoins)).toString();
    updateBalanceDisplay();
});

// Reset function
document.getElementById('reset').addEventListener('click', () => {
    resultText.innerText = '';
    betAmountInput.value = '';
});

// Function to update the balance display
const updateBalanceDisplay = () => {
    balanceText.innerText = `Balance: ${web3.utils.fromWei(userBalance, 'ether')} ETH`;
};
