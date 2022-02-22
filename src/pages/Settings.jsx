import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, useAccount, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { Tabs, Tab, Button, Form } from "react-bootstrap";
import { loginRequest, protectedResources } from "../authConfig";
import { callApiWithToken } from "../fetch";
import { AddRole } from "../components/RoleTabDisplay";
import { EmailComponent } from "../components/EmailComponent";
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
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedGroupe, setSelectedGroupe] = useState(null);
  const [selectedEmail, setEmail] = useState(null);
  const roles = mapGraphDataToRoles(graphData);
  const groupes = mapGraphDataToRoles(graphData);

  async function handleSumbitAssignRole(event, selectedItem, selectedEmail, selectedRoleId) {
    event.preventDefault();
    const response = await instance.acquireTokenSilent({ scopes: protectedResources?.graphGetUserByEmail.scopes, account });
    const graphGetUserByEmailResponse = await callApiWithToken(response.accessToken, `${protectedResources?.graphGetUserByEmail.endpoint}%20'${selectedEmail}'`, protectedResources?.graphGetUserByEmail.httpVerb);
    const body = {
      principalId: graphGetUserByEmailResponse?.value?.[0].id, // id de l’utilisateur, de groupe ou le client servicePrincipal auquel vous attribuez le rôle d’application.
      resourceId: 'ce7e8727-2dd4-40cd-b7dc-c004dd28e09e', // id du servicePrincipal de ressource qui a défini le rôle de l’application.
      appRoleId: selectedRoleId // id du appRole (définie sur le principal di service de ressource) à attribuer à l’utilisateur, groupe ou principal du service.
    }
    const graphPostAppRoleAssignedToResponse = await callApiWithToken(response.accessToken, protectedResources?.graphPostAppRoleAssignedTo.endpoint, protectedResources?.graphPostAppRoleAssignedTo.httpVerb, body);
    console.log(`Add Role : ${selectedItem} to User ${selectedEmail}`, body, graphPostAppRoleAssignedToResponse);
  }

  async function handleSumbitAssignGroup(event, selectedItem, selectedEmail) {
    event.preventDefault();
    const endpoint = `${protectedResources?.graphGetUserByEmail.endpoint} ${email}`;
    const scopes = protectedResources?.graphGetUserByEmail.scopes;
    const httpVerb = protectedResources?.graphGetUserByEmail.httpVerb;
    const response = await instance.acquireTokenSilent({ scopes, account })
    const data = await callApiWithToken(response.accessToken, endpoint, httpVerb)
    console.log(`Add Role : ${selectedItem} to User ${endpoint}`, data);
  }

  function mapGraphDataToRoles(_graphData) {
    return _graphData?.value.map((v) => { return { value: v.value, appRoleId: v.id }});
  }

  useEffect(async () => {
    const scopes = protectedResources?.graphAppRoles.scopes;
    const endpoint = protectedResources?.graphAppRoles.endpoint;
    const httpVerb = protectedResources?.graphAppRoles.httpVerb;

    try {
      if (account && inProgress === "none" && !graphData) {
        const response = await instance.acquireTokenSilent({ scopes, account })
        const data = await callApiWithToken(response.accessToken, endpoint, httpVerb)
        setSelectedRole(mapGraphDataToRoles(data)[0].value);
        setSelectedRoleId(mapGraphDataToRoles(data)[0].appRoleId);
        setGraphData(data);
      }
    } catch (error) {
      // in case if silent token acquisition fails, fallback to an interactive method
      if (error instanceof InteractionRequiredAuthError) {
        if (account && inProgress === "none") {
          const response = await instance.acquireTokenPopup({ scopes })
          const data = await callApiWithToken(response.accessToken, endpoint, 'GET')
          setSelectedRole(mapGraphDataToRoles(data)?.[0].value);
          setSelectedRoleId(mapGraphDataToRoles(data)?.[0].appRoleId);
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
        {false ? (
          <>
            <div className="container-md">
              <Form onSubmit={(event) => handleSumbitAssignGroup(event, selectedRole, selectedEmail, selectedRoleId)}>
                <AddGroupe groupes={roles} selectedGroupe={selectedRole} setSelectedGroupe={setSelectedRole} />
                <EmailComponent setEmail={setEmail} />
                <Button variant="primary" type="submit" >
                  Assign Role
                </Button>
              </Form>

            </div>
          </>
        ) : null}
      </Tab>
      <Tab eventKey="role" title="Role">
        {roles ? (
          <>
            <div className="container-md">
              <Form onSubmit={(event) => handleSumbitAssignRole(event, selectedRole, selectedEmail, selectedRoleId)}>
                <Form.Group controlId="role">
                  <AddRole roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} setSelectedRoleId={setSelectedRoleId} />
                  <EmailComponent setEmail={setEmail} />
                </Form.Group>
                <Button variant="primary" type="submit" >
                  Assign Role
                </Button>
              </Form>
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
