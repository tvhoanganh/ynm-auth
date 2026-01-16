export type OauthOptions = {
  client_id: string;
  redirect_uri: string;
  state: string;
  response_type: string;
  scope: string;
  code_challenge: string;
  code_challenge_method: string;
  flow: string;
};
