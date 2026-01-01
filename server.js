const express = require('express'); const axios = require('axios'); require('dotenv').config();

const app = express(); app.use(express.json());

// Endpoint to receive HubSpot Webhooks (e.g., Deal Won) app.post('/webhooks/hubspot-to-suitedash', async (req, res) => { const dealData = req.body[0];

try {
    console.log(`🚀 Processing Deal: ${dealData.objectId}`);
    
    // 1. Fetch full deal details from HubSpot
    const hubspotDeal = await axios.get(`https://api.hubapi.com/crm/v3/objects/deals/${dealData.objectId}`, {
        headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` }
    });

    const clientEmail = hubspotDeal.data.properties.client_email;
    const projectName = hubspotDeal.data.properties.dealname;

    // 2. Create Client in SuiteDash
    const suitedashResponse = await axios.post('[https://api.suitedash.com/v1/clients](https://api.suitedash.com/v1/clients)', {
        email: clientEmail,
        first_name: hubspotDeal.data.properties.contact_first_name || 'New',
        last_name: hubspotDeal.data.properties.contact_last_name || 'Client'
    }, {
        headers: { 'Authorization': `Bearer ${process.env.SUITEDASH_API_KEY}` }
    });

    // 3. Create Project in SuiteDash
    await axios.post('[https://api.suitedash.com/v1/projects](https://api.suitedash.com/v1/projects)', {
        title: projectName,
        client_id: suitedashResponse.data.id
    }, {
        headers: { 'Authorization': `Bearer ${process.env.SUITEDASH_API_KEY}` }
    });

    res.status(200).send('Successfully synced to SuiteDash');
} catch (error) {
    console.error('❌ Integration Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Error during synchronization');
}


});

const PORT = process.env.PORT || 3000; app.listen(PORT, () => console.log(Master Integration Hub running on port ${PORT}));