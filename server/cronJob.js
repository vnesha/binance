const cron = require('node-cron');
const axios = require('axios');

function myCronJob() {
    const url1 = 'http://localhost:3000/api/get-settings/';
    const url2 = 'http://localhost:3000/api/get-open-position-orders/';

    Promise.all([axios.get(url1), axios.get(url2)])
        .then(([response1, response2]) => {
            const { autoTrading, tralingTPLimit, tralingTPDeviation, maxProfit: maxProfitFromDB } = response1.data;
            let maxProfit = maxProfitFromDB;
            const openPositionOrders = response2.data;

            if (autoTrading) {
                const totalUnRealizedProfit = openPositionOrders.reduce((total, order) => {
                    return total + parseFloat(order.unRealizedProfit);
                }, 0);

                console.log('Trailing TP Limit:', tralingTPLimit, 'Traling TP Deviation:', tralingTPDeviation, 'Total Unrealized Profit:', totalUnRealizedProfit);

                if (totalUnRealizedProfit > tralingTPLimit && totalUnRealizedProfit > maxProfit) {
                    maxProfit = totalUnRealizedProfit;

                    const settingsUrl = 'http://localhost:3000/api/save-settings';
                    const data = {
                        maxProfit: maxProfit
                    };

                    axios.post(settingsUrl, data)
                        .then(res => {
                            console.log('Data successfully sent to the server:', res.data, 'Max profit:', maxProfit);
                        })
                        .catch(error => {
                            console.error('Error sending data to the server:');
                            handleAxiosError(error);
                        });
                } else if ((maxProfit - totalUnRealizedProfit) / maxProfit * 100 > tralingTPDeviation) {
                    // Here, close all positions
                    axios.post('http://localhost:3000/api/close-all-positions-and-orders')
                        .then(res => {
                            console.log('All positions closed successfully');
                        })
                        .catch(error => {
                            console.error('Error closing all positions:');
                            handleAxiosError(error);
                        });

                    // Reset maxProfit
                    const settingsUrl = 'http://localhost:3000/api/save-settings';
                    const data = {
                        maxProfit: 0
                    };
                    axios.post(settingsUrl, data)
                        .then(res => {
                            console.log('Max profit reset successfully');
                        })
                        .catch(error => {
                            console.error('Error resetting max profit:');
                            handleAxiosError(error);
                        });
                }
            } else {
                console.log('Auto-trading je onemogućen ili nedostaje vrednost postavke. Cron job nije pokrenut.');
            }
        })
        .catch(error => {
            console.error('Greška prilikom slanja HTTP zahteva:', error);
        });
}

function handleAxiosError(error) {
    if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
    } else if (error.request) {
        console.error('Request:', error.request);
    } else {
        console.error('Message:', error.message);
    }
    console.error('Config:', error.config);

    try {
        const jsonData = JSON.parse(error.response.data);
        console.error('JSON error data:', jsonData);
    } catch (e) {
        console.error('Raw error data:', error.response.data);
    }
}

// Run cron job every 5 seconds
cron.schedule('*/5 * * * * *', () => {
    myCronJob();
});
