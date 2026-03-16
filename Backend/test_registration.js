const axios = require('axios');

async function testRegistration() {
    try {
        console.log("Attempting to register a new test user...");
        const randomStr = Math.random().toString(36).substring(7);
        const email = `testuser_${randomStr}@example.com`;
        
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            first_name: "John",
            last_name: "Doe",
            phone_number: "1234567890",
            email_id: email,
            password: "Password123"
        });
        
        console.log("Response from server:", response.data);
    } catch (error) {
        console.error("Error during registration:", error.response?.data || error.message);
    }
}

testRegistration();
