import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      region: import.meta.env.VITE_AWS_REGION
    }
  }
};

if (!awsConfig.Auth.Cognito.userPoolId) {
  throw new Error('VITE_COGNITO_USER_POOL_ID is not defined in environment variables');
}
if (!awsConfig.Auth.Cognito.userPoolClientId) {
  throw new Error('VITE_COGNITO_CLIENT_ID is not defined in environment variables');
}
if (!awsConfig.Auth.Cognito.region) {
  throw new Error('VITE_AWS_REGION is not defined in environment variables');
}

Amplify.configure(awsConfig);

export default awsConfig;