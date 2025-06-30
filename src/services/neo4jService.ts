import neo4j, { Driver, Session, Record } from 'neo4j-driver';

export interface Neo4jCredentials {
  uri: string;
  username: string;
  password: string;
}

export interface Neo4jNode {
  id: string;
  labels: string[];
  properties: Record<string, any>;
  x?: number;
  y?: number;
}

export interface Neo4jRelationship {
  id: string;
  type: string;
  startNodeId: string;
  endNodeId: string;
  properties: Record<string, any>;
}

export interface Neo4jGraph {
  nodes: Neo4jNode[];
  relationships: Neo4jRelationship[];
}

class Neo4jService {
  private driver: Driver | null = null;
  private session: Session | null = null;

  async connect(credentials: Neo4jCredentials): Promise<boolean> {
    try {
      this.driver = neo4j.driver(
        credentials.uri,
        neo4j.auth.basic(credentials.username, credentials.password)
      );

      // Test the connection
      await this.driver.verifyConnectivity();
      this.session = this.driver.session();
      
      console.log('Successfully connected to Neo4j');
      return true;
    } catch (error) {
      console.error('Failed to connect to Neo4j:', error);
      this.disconnect();
      throw new Error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.session) {
        await this.session.close();
        this.session = null;
      }
      if (this.driver) {
        await this.driver.close();
        this.driver = null;
      }
      console.log('Disconnected from Neo4j');
    } catch (error) {
      console.error('Error disconnecting from Neo4j:', error);
    }
  }

  isConnected(): boolean {
    return this.driver !== null && this.session !== null;
  }

  async getGraphData(limit: number = 100): Promise<Neo4jGraph> {
    if (!this.session) {
      throw new Error('Not connected to Neo4j database');
    }

    try {
      const query = `
        MATCH (n)-[r]->(m)
        RETURN n, r, m
        LIMIT $limit
      `;

      const result = await this.session.run(query, { limit });
      
      const nodes = new Map<string, Neo4jNode>();
      const relationships: Neo4jRelationship[] = [];

      result.records.forEach((record: Record) => {
        const startNode = record.get('n');
        const relationship = record.get('r');
        const endNode = record.get('m');

        // Process start node
        if (startNode && !nodes.has(startNode.identity.toString())) {
          nodes.set(startNode.identity.toString(), {
            id: startNode.identity.toString(),
            labels: startNode.labels,
            properties: startNode.properties,
            x: Math.random() * 500 + 50,
            y: Math.random() * 300 + 50
          });
        }

        // Process end node
        if (endNode && !nodes.has(endNode.identity.toString())) {
          nodes.set(endNode.identity.toString(), {
            id: endNode.identity.toString(),
            labels: endNode.labels,
            properties: endNode.properties,
            x: Math.random() * 500 + 50,
            y: Math.random() * 300 + 50
          });
        }

        // Process relationship
        if (relationship) {
          relationships.push({
            id: relationship.identity.toString(),
            type: relationship.type,
            startNodeId: relationship.start.toString(),
            endNodeId: relationship.end.toString(),
            properties: relationship.properties
          });
        }
      });

      return {
        nodes: Array.from(nodes.values()),
        relationships
      };
    } catch (error) {
      console.error('Error fetching graph data:', error);
      throw new Error(`Failed to fetch graph data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getNodesByLabel(label: string, limit: number = 50): Promise<Neo4jNode[]> {
    if (!this.session) {
      throw new Error('Not connected to Neo4j database');
    }

    try {
      const query = `
        MATCH (n:${label})
        RETURN n
        LIMIT $limit
      `;

      const result = await this.session.run(query, { limit });
      
      return result.records.map((record: Record) => {
        const node = record.get('n');
        return {
          id: node.identity.toString(),
          labels: node.labels,
          properties: node.properties,
          x: Math.random() * 500 + 50,
          y: Math.random() * 300 + 50
        };
      });
    } catch (error) {
      console.error('Error fetching nodes by label:', error);
      throw new Error(`Failed to fetch nodes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async executeCustomQuery(query: string, parameters: Record<string, any> = {}): Promise<Record[]> {
    if (!this.session) {
      throw new Error('Not connected to Neo4j database');
    }

    try {
      const result = await this.session.run(query, parameters);
      return result.records;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDatabaseInfo(): Promise<any> {
    if (!this.session) {
      throw new Error('Not connected to Neo4j database');
    }

    try {
      const queries = [
        'CALL db.labels()',
        'CALL db.relationshipTypes()',
        'MATCH (n) RETURN count(n) as nodeCount',
        'MATCH ()-[r]->() RETURN count(r) as relationshipCount'
      ];

      const results = await Promise.all(
        queries.map(query => this.session!.run(query))
      );

      return {
        labels: results[0].records.map(r => r.get('label')),
        relationshipTypes: results[1].records.map(r => r.get('relationshipType')),
        nodeCount: results[2].records[0]?.get('nodeCount').toNumber() || 0,
        relationshipCount: results[3].records[0]?.get('relationshipCount').toNumber() || 0
      };
    } catch (error) {
      console.error('Error getting database info:', error);
      throw new Error(`Failed to get database info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const neo4jService = new Neo4jService();