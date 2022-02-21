import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, useAccount, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { Tabs, Tab, Nav, Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { loginRequest, protectedResources } from "../authConfig";
import { callApiWithToken } from "../fetch";
import { AddRole } from "../components/RoleTabDisplay";
import { EmailComponent } from "../components/EmailComponent";
import { ButtonAssignRoleComponent } from "../components/ButtonAssignRoleComponent";
import { AddGroupe } from "../components/GroupeTabDisplay";


const SettingsContent = () => {
  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [graphData, setGraphData] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGroupe, setSelectedGroupe] = useState(null);
  const [email, setEmail] = useState(null);
  const roles = mapGraphDataToRoles(graphData);
  const groupes = mapGraphDataToRoles(graphData);

  function mapGraphDataToRoles(_graphData) {
    return _graphData?.value.map((v) => v.value);
  }

  useEffect(async () => {
    const scopes = protectedResources?.graphAppRoles.scopes;
    const endpoint = protectedResources?.graphAppRoles.endpoint;

    try {
      if (account && inProgress === "none" && !graphData) {
        const response = await instance.acquireTokenSilent({ scopes, account })
        const data = await callApiWithToken(response.accessToken, endpoint, 'GET')
        setSelectedRole(mapGraphDataToRoles(data)[0]);
        setGraphData(data);
      }
    } catch (error) {
      // in case if silent token acquisition fails, fallback to an interactive method
      if (error instanceof InteractionRequiredAuthError) {
        if (account && inProgress === "none") {
          const response = await instance.acquireTokenPopup({ scopes })
          const data = await callApiWithToken(response.accessToken, endpoint, 'GET')
          setSelectedRole(mapGraphDataToRoles(data)[0]);
          setGraphData(data);
        }
      }
    }
  }, [account, inProgress, instance]);

  return (
    <Tabs
      defaultActiveKey="groupe"
      transition={false}
      id="noanim-tab-example"
      className="mb-2">
      <Tab eventKey="groupe" title="Groupe">
      {/* {roles ? (
          <>
            <div className="container-md">
              <AddGroupe groupes={groupes} selectedGroupe={selectedGroupe} setSelectedGroupe={setSelectedGroupe} />
              <EmailComponent setEmail={setEmail} />
              <ButtonAssignRoleComponent selectedGroupe={selectedGroupe} email={email}/>
            </div>
          </>
        ) : null} */}
      </Tab>
      <Tab eventKey="role" title="Role">
        {roles ? (
          <>
            <div className="container-md">
              <AddRole roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
              <EmailComponent setEmail={setEmail} />
              <ButtonAssignRoleComponent selectedRole={selectedRole} email={email}/>
            </div>
          </>
        ) : null}
      </Tab>
    </Tabs>

  );
};

/**
 * The `MsalAuthenticationTemplate` component will render its children if a user is authenticated
 * or attempt to sign a user in. Just provide it with the interaction type you would like to use
 * (redirect or popup) and optionally a [request object](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md)
 * to be passed to the login API, a component to display while authentication is in progress or a component to display if an error occurs. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const Settings = () => {
  const authRequest = {
    ...loginRequest,
  };

  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={authRequest}>
      <SettingsContent />
    </MsalAuthenticationTemplate>
  );
};
