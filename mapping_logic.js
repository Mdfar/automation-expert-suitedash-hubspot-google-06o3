/**

Utility to map Jotform fields to HubSpot properties */ const mapJotformToHubSpot = (formData) => { return { fields: [ { name: "email", value: formData.q3_email }, { name: "firstname", value: formData.q1_firstName }, { name: "lastname", value: formData.q2_lastName }, { name: "company", value: formData.q4_companyName }, { name: "lifecyclestage", value: "lead" } ] }; };

module.exports = { mapJotformToHubSpot };