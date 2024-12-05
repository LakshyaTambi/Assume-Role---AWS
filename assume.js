const AWS = require('aws-sdk');
const sts = new AWS.STS();

// Global variable to hold the temporary credentials
let temporaryCredentials = null;
let expirationTime = null;  // Track the expiration time of the credentials

// Function to assume role and fetch temporary credentials
async function assumeRole() {
  const params = {
    RoleArn: 'arn:aws:iam::579290781153:role/dev-iam_for_lambda',  // Role ARN
    RoleSessionName: 'your-session-name',  // Unique session name
  };

  try {
    const data = await sts.assumeRole(params).promise();
    // Store the temporary credentials
    temporaryCredentials = data.Credentials;
    console.log("data.creds",data.Credentials)
    // Calculate expiration time in milliseconds
    expirationTime = new Date().getTime() + (temporaryCredentials.Expiration.getTime() - Date.now());
     console.log("expiration time",expirationTime)
    // Set the credentials to AWS SDK globally
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: temporaryCredentials.AccessKeyId,
      secretAccessKey: temporaryCredentials.SecretAccessKey,
      sessionToken: temporaryCredentials.SessionToken,
    });

    console.log('Temporary credentials obtained and set for AWS SDK');

    // Continue using AWS SDK for your API calls here (e.g., OpenSearch, S3, etc.)

  } catch (err) {
    console.error('Error assuming role:', err);
  }
}

// Function to refresh the credentials if they are about to expire
async function refreshCredentialsIfNeeded() {
  const currentTime = new Date().getTime();

  // If the credentials are about to expire (e.g., within 5 minutes), refresh them
  if (expirationTime && currentTime + 5 * 60 * 1000 >= expirationTime) {
    console.log('Credentials are about to expire, refreshing...');
    await assumeRole();  // Re-assume the role and get new temporary credentials
  }
}

// Call this function to ensure credentials are refreshed every 5 minutes
setInterval(async () => {
  await refreshCredentialsIfNeeded();
}, 5 * 60 * 1000);  // Refresh every 5 minutes (300,000 ms)

// Initial role assumption to kickstart the process
assumeRole();
