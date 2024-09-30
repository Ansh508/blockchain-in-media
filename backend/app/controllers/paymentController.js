// controllers/paymentController.js
import Web3 from 'web3';
import Payment from '../build/contracts/Payment.json' assert { type: "json" };
import Content from '../build/contracts/Content.json' assert { type: "json" };

const web3 = new Web3('http://localhost:8545');
const paymentAddress = '0x93F6426Ecf69dA9370070C9E57211def52402259'; 
const contentAddress = '0xc7C306d63b9c272509988d2A355b8935D375eCCe'; 

const paymentContract = new web3.eth.Contract(Payment.abi, paymentAddress);
const contentContract = new web3.eth.Contract(Content.abi, contentAddress);

// Function to pay the content creator
export const payContentCreator = async (req, res) => {
    const { contentId } = req.body;
    const buyerAddress = req.user.address; 

    try {
        const contentDetails = await contentContract.methods.getContent(contentId).call();
        const price = contentDetails[2];

        await paymentContract.methods.payCreator(contentId, contentDetails[0]).send({ from: buyerAddress, value: price });

        res.status(200).json({ message: "Payment made successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to get transaction details
export const getTransaction = async (req, res) => {
    const { transactionId } = req.params;
    try {
        const transactionDetails = await paymentContract.methods.getTransaction(transactionId).call();
        res.status(200).json({
            payer: transactionDetails[0],
            creator: transactionDetails[1],
            contentId: transactionDetails[2],
            amount: web3.utils.fromWei(transactionDetails[3], 'ether')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
