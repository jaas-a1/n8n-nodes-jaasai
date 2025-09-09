import { Jaasai } from '../Jaasai.node';
import type { IExecuteFunctions } from 'n8n-workflow';

describe('Jaasai Node', () => {
  it('should process API response with mock API key', async () => {
    const node = new Jaasai();

    const context = {
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'jaas_mock_api_key' }),
      helpers: {
        request: jest.fn().mockImplementation((options) => {
          expect(options.body).toEqual({
            question: "What is the capital of France?",
            answer: "The capital of France is Paris.",
            ground_truth_answer: "The capital of France is Paris.",
            context: "The capital of France is Paris.",
            cohort: "test_cohort",
            evaluation_criteria: ["Accuracy"],
            type: "S",
          });
          return Promise.resolve({
            status: "completed",
            criteria: {
              Accuracy: {},
            },
          });
        }),
      },
      getInputData: jest.fn().mockReturnValue([
        {
          json: {
            question: "What is the capital of France?",
            answer: "The capital of France is Paris.",
            ground_truth_answer: "The capital of France is Paris.",
            context: "The capital of France is Paris.",
            cohort: "test_cohort",
          },
        },
      ]),
      getNodeParameter: jest.fn().mockImplementation((param) => {
        if (param === 'criteria') return ["Accuracy"];
        if (param === 'type') return "S";
        return '';
      }),
      getNode: jest.fn(),
      logger: console,
      getCredentialsProperties: jest.fn(),
      getExecutionId: jest.fn(),
      getWorkflow: jest.fn(),
      getWorkflowData: jest.fn(),
      getWorkflowStaticData: jest.fn(),
      getTimezone: jest.fn(),
      getWorkflowParameter: jest.fn(),
      getWorkflowSettings: jest.fn(),
      getCurrentNode: jest.fn(),
      getRunData: jest.fn(),
      getWorkflowId: jest.fn(),
      getWorkflowName: jest.fn(),
      getWorkflowOwner: jest.fn(),
      getRestApiUrl: jest.fn(),
      getInstanceBaseUrl: jest.fn(),
      getInstanceId: jest.fn(),
      getChildNodes: jest.fn(),
      getParentNodes: jest.fn(),
      getNodeType: jest.fn(),
      getWorkflowVersionId: jest.fn(),
      getKnownNodeTypes: jest.fn(),
      prepareOutputData: jest.fn((data) => data),
      getMode: jest.fn().mockReturnValue('manual'),
    } as unknown as IExecuteFunctions; // <-- Explicit cast here

    const result = await node.execute.call(context);

    expect(result[0][0].json.status).toBe('completed');
    expect(result[0][0].json.criteria).toHaveProperty('Accuracy');
  });
});
