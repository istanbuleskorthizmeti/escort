import axios from 'axios';

const HASHNODE_KEY = 'c4e0aea8-3bc7-4a04-afc7-ba13c4ad46a5';

async function testHashnode() {
  console.log("Checking Hashnode API...");
  try {
    const response = await axios.post(
      'https://gql.hashnode.com/',
      {
        query: `
          query {
            me {
              id
              username
            }
          }
        `
      },
      {
        headers: {
          'Authorization': HASHNODE_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log("Error:", error.response?.data || error.message);
  }
}

testHashnode();
