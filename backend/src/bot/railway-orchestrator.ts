import { IAgentConfig } from '../models/AgentConfig';
import { Log } from '../models/Log';
import { config as appConfig } from '../config';
import crypto from 'crypto';

const RAILWAY_API_URL = 'https://backboard.railway.app/graphql/v2';

export class RailwayOrchestrator {
  private static async fetchGraphQL(query: string, variables: any = {}) {
    const response = await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appConfig.railwayProjectToken}`,
        'Project-Access-Token': appConfig.railwayProjectToken
      },
      body: JSON.stringify({ query, variables })
    });

    const body = await response.json();
    if (body.errors) {
      console.error('[RailwayOrchestrator] GraphQL Errors:', JSON.stringify(body.errors, null, 2));
      throw new Error(body.errors[0].message);
    }
    return body.data;
  }

  static async getEnvironmentId(): Promise<string> {
    const query = `
      query GetProject($id: String!) {
        project(id: $id) {
          environments {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `;
    const data = await this.fetchGraphQL(query, { id: appConfig.railwayProjectId });
    const edges = data.project.environments.edges;
    if (!edges || edges.length === 0) {
      throw new Error('No environment found in Railway project.');
    }
    // Return the ID of the first environment (usually Production)
    return edges[0].node.id;
  }

  static async deployAgent(config: IAgentConfig): Promise<{ serviceId: string, domain: string, setupPassword: string } | null> {
    try {
      if (!appConfig.railwayProjectToken || !appConfig.railwayProjectId) {
        throw new Error('Railway configuration is missing (Token or Project ID)');
      }

      console.log(`[RailwayOrchestrator] Deploying agent for user ${config.userId}`);
      const environmentId = await this.getEnvironmentId();

      // 1. Create a new service
      const createServiceQuery = `
        mutation ServiceCreate($input: ServiceCreateInput!) {
          serviceCreate(input: $input) {
            id
            name
          }
        }
      `;
      const createServiceVars = {
        input: {
          projectId: appConfig.railwayProjectId,
          name: `bot-${config.userId.toString().substring(0, 8)}`,
          source: {
            repo: "elhadjx/bitslave"
          }
        }
      };
      
      const createResult = await this.fetchGraphQL(createServiceQuery, createServiceVars);
      const serviceId = createResult.serviceCreate.id;

      // 1.1 Set root directory to instance_template
      const updateInstanceQuery = `
        mutation ServiceInstanceUpdate($serviceId: String!, $environmentId: String!, $input: ServiceInstanceUpdateInput!) {
          serviceInstanceUpdate(serviceId: $serviceId, environmentId: $environmentId, input: $input)
        }
      `;
      await this.fetchGraphQL(updateInstanceQuery, {
        serviceId: serviceId,
        environmentId: environmentId,
        input: {
          rootDirectory: "/instance_template"
        }
      });

      // 1.5 Create Volume and mount it at /data
      const createVolumeQuery = `
        mutation VolumeCreate($input: VolumeCreateInput!) {
          volumeCreate(input: $input) {
            id
          }
        }
      `;
      const createVolumeVars = {
        input: {
          projectId: appConfig.railwayProjectId,
          environmentId: environmentId,
          serviceId: serviceId,
          mountPath: "/data"
        }
      };
      
      await this.fetchGraphQL(createVolumeQuery, createVolumeVars);

      // 2. Set Environment Variables
      const upsertVarsQuery = `
        mutation VariableCollectionUpsert($input: VariableCollectionUpsertInput!) {
          variableCollectionUpsert(input: $input)
        }
      `;
      
      // Generate secure random setup password
      const setupPassword = crypto.randomBytes(16).toString('hex');
      const gatewayToken = crypto.randomBytes(32).toString('hex');

      // Build callback URL for the instance to POST status updates to our backend
      // Use BACKEND_URL if set (production), otherwise fall back to frontendUrl-based construction (local dev)
      const backendUrl = appConfig.backendUrl || `${appConfig.frontendUrl.replace(/:\d+$/, '')}:${appConfig.port}`;
      const callbackUrl = `${backendUrl}/api/instance-callback`;

      // Serialize skills config for the instance
      const skillsJson = config.skills ? JSON.stringify(config.skills) : undefined;

      const variables: Record<string, string> = {
        // OpenClaw core config (fixed: was CLAWDBOT_*)
        OPENCLAW_STATE_DIR: "/data/.openclaw",
        OPENCLAW_WORKSPACE_DIR: "/data/workspace",
        OPENCLAW_GATEWAY_TOKEN: gatewayToken,
        SETUP_PASSWORD: setupPassword,

        // Auto-setup: LLM provider config
        LLM_PROVIDER: config.llmProvider,
        LLM_API_KEY: config.llmApiKey,

        // Auto-setup: Telegram token
        TELEGRAM_TOKEN: config.telegramToken,

        // Webhook callback for status updates
        CALLBACK_URL: callbackUrl,
        BACKEND_API_URL: backendUrl,
        INSTANCE_ID: serviceId,

        // Skills injection
        ...(skillsJson ? { SKILLS_JSON: skillsJson } : {}),
      };

      const upsertVars = {
        input: {
          projectId: appConfig.railwayProjectId,
          environmentId: environmentId,
          serviceId: serviceId,
          variables: variables
        }
      };

      await this.fetchGraphQL(upsertVarsQuery, upsertVars);

      // 3. Generate Domain
      const domainQuery = `
        mutation ServiceDomainCreate($input: ServiceDomainCreateInput!) {
          serviceDomainCreate(input: $input) {
            domain
          }
        }
      `;
      const domainResult = await this.fetchGraphQL(domainQuery, {
        input: {
          environmentId: environmentId,
          serviceId: serviceId
        }
      });
      const generatedDomain = domainResult.serviceDomainCreate.domain;

      console.log(`[RailwayOrchestrator] Agent deployed successfully with serviceId: ${serviceId}, domain: ${generatedDomain}`);
      return { serviceId, domain: generatedDomain, setupPassword };
    } catch (error) {
      console.error(`[RailwayOrchestrator] Failed to deploy agent:`, error);
      return null;
    }
  }

  static async stopAgent(serviceId?: string): Promise<boolean> {
    try {
      if (!appConfig.railwayProjectToken) {
         throw new Error('Railway configuration is missing');
      }

      if (!serviceId) {
         console.warn(`[RailwayOrchestrator] No service ID provided. Cannot stop agent.`);
         return false;
      }

      console.log(`[RailwayOrchestrator] Stopping service ${serviceId}`);

      const deleteServiceQuery = `
        mutation ServiceDelete($id: String!) {
          serviceDelete(id: $id)
        }
      `;
      await this.fetchGraphQL(deleteServiceQuery, { id: serviceId });

      console.log(`[RailwayOrchestrator] Agent service ${serviceId} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`[RailwayOrchestrator] Failed to stop agent:`, error);
      return false;
    }
  }
}
