//CLIENT_ID and TENANT_ID both extracted from constants file (externailsing them - not in source code repository)
import { CLIENT_ID } from "../../config"
import { TENANT_ID } from "../../config"
import { redirectUri } from "../../config"
 
export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: redirectUri,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile"],
};