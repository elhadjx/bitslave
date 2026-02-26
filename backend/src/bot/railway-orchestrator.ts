import { IAgentConfig } from '../models/AgentConfig';
import { Log } from '../models/Log';
import { config as appConfig } from '../config';

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

  static async deployAgent(config: IAgentConfig): Promise<string | null> {
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
            repo: "vignesh07/clawdbot-railway-template"
          }
        }
      };
      
      const createResult = await this.fetchGraphQL(createServiceQuery, createServiceVars);
      const serviceId = createResult.serviceCreate.id;

      // 2. Set Environment Variables
      const upsertVarsQuery = `
        mutation VariableCollectionUpsert($input: VariableCollectionUpsertInput!) {
          variableCollectionUpsert(input: $input)
        }
      `;
      
      // Map BitSlave variables to what OpenClaw expects (adjust variable names if openclaw uses different ones)
      const variables: Record<string, string> = {
        TELEGRAM_TOKEN: config.telegramToken,
        LLM_PROVIDER: config.llmProvider,
        OPENAI_API_KEY: config.llmApiKey 
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

      console.log(`[RailwayOrchestrator] Agent deployed successfully with serviceId: ${serviceId}`);
      return serviceId;
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
