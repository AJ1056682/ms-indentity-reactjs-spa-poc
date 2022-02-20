import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, useAccount, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { loginRequest, protectedResources } from "../authConfig";
import { callApiWithToken } from "../fetch";

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
  const [email, setEmail] = useState(null);
  const roles = mapGraphDataToRoles(graphData);

  function mapGraphDataToRoles(_graphData) {
    return _graphData?.value.map((v) => v.value);
  }

  function handleSumbit(event) {
    event.preventDefault();
    console.log({ email, selectedRole });
  }

  useEffect(() => {
    if (account && inProgress === "none" && !graphData) {
      instance
        .acquireTokenSilent({
          scopes: protectedResources.graphAppRoles.scopes,
          account: account,
        })
        .then((response) => {
          callApiWithToken(response.accessToken, protectedResources.graphAppRoles.endpoint).then((response) => {
            setSelectedRole(mapGraphDataToRoles(response)[0]);
            setGraphData(response);
          });
        })
        .catch((error) => {
          // in case if silent token acquisition fails, fallback to an interactive method
          if (error instanceof InteractionRequiredAuthError) {
            if (account && inProgress === "none") {
              instance
                .acquireTokenPopup({
                  scopes: protectedResources.graphAppRoles.scopes,
                })
                .then((response) => {
                  callApiWithToken(response.accessToken, protectedResources.graphAppRoles.endpoint).then((response) => {
                    setSelectedRole(mapGraphDataToRoles(response)[0]);
                    setGraphData(response);
                  });
                })
                .catch((error) => console.log(error));
            }
          }
        });
    }
  }, [account, inProgress, instance]);
  return (
    <>
      {roles ? (
        <div className="container-md">
          <Form onSubmit={handleSumbit}>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                }}
              >
                {roles.map((role, index) => (
                  <option key={index}>{role}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Assign Role
            </Button>
          </Form>
        </div>
      ) : null}

      {/* <pre>{JSON.stringify(roles, null, 2)}</pre> */}
    </>
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
