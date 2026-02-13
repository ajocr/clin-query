declare module "*.jpg";
declare module "*.png";


interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string
  readonly VITE_COGNITO_USER_POOL_ID: string
  readonly VITE_COGNITO_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}