import Web3 from 'web3';
import Payment from '../build/contracts/Payment.json' assert { type: "json" };

const web3 = new Web3('http://localhost:8545'); // Replace with your provider
const paymentContractAddress = '0x93F6426Ecf69dA9370070C9E57211def52402259'; // Replace with deployed contract address
const paymentContract = new web3.eth.Contract(Payment.abi, paymentContractAddress);

export const payCreator = async (payerAddress, contentId, creatorAddress, amount) => {
    try {
        await paymentContract.methods.payCreator(contentId, creatorAddress, amount).send({
            from: payerAddress,
            value: web3.utils.toWei(amount.toString(), 'ether'),
        });
        console.log('Payment made successfully');
    } catch (error) {
        throw new Error(`Failed to make payment: ${error.message}`);
    }
};

export const getTransaction = async (transactionId) => {
    try {
        const transaction = await paymentContract.methods.getTransaction(transactionId).call();
        return {
            payer: transaction[0],
            creator: transaction[1],
            contentId: transaction[2],
            amount: web3.utils.fromWei(transaction[3], 'ether'),
        };
    } catch (error) {
        throw new Error(`Failed to get transaction: ${error.message}`);
    }
};
