
import type { NodeConnectionType } from 'n8n-workflow';

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  //NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';

export class Jaasai implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'JaaS AI',
    name: 'jaasai',
    icon: 'file:jaas_icon.svg',
    group: ['transform'],
    version: 1,
    description: 'Evaluate AI Agents with JaaS',
    defaults: {
      name: 'JaasAi',
    },
    inputs: ['main' as NodeConnectionType],
    outputs: ['main' as NodeConnectionType],
    credentials: [
      {
        name: 'jaasaiApi',
        required: true,
      },
    ],
    properties: [

			{
  			displayName: 'Evaluation Criteria #1',
  			name: 'criteria1',
  			type: 'string',
  			default: 'Accuracy',
  			//required: false,
			},
			{
  			displayName: 'Evaluation Criteria #2',
  			name: 'criteria2',
  			type: 'string',
  			default: '',
  			//required: false,
			},
			{
  			displayName: 'Evaluation Criteria #3',
  			name: 'criteria3',
  			type: 'string',
  			default: '',
  			//required: false,
			},
		{
  			displayName: 'Evaluation Criteria #4',
  			name: 'criteria4',
  			type: 'string',
  			default: '',
  			//required: false,
			},
			{
  			displayName: 'Evaluation Criteria #5',
  			name: 'criteria5',
  			type: 'string',
  			default: '',
  			//required: false,
			},

			{
				displayName: 'Type of Evaluation',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Simple',
						value: 'S',
					},
					{
						name: 'Conversational (S)',
						value: 'D',
					},
					{
						name: 'Verified',
						value: 'V',
					},
				],
				default: 'S',
				//required: false,
			},

    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    for (let i = 0; i < items.length; i++) {
      try {
        //const city = this.getNodeParameter('city', i) as string;
        const question = items[i].json.question as string||"";
				const answer  = items[i].json.answer as string||"";
				const context = items[i].json.context as string||"";
				const ground_truth_answer = items[i].json.ground_truth_answer as string||"";
				const cohort = items[i].json.cohort as string||"N8N-NC";

				const evaluation_criteria1 = this.getNodeParameter('criteria1', i) as string ||"Accuracy";
				const evaluation_criteria2 = this.getNodeParameter('criteria2', i) as string ||"";
				const evaluation_criteria3 = this.getNodeParameter('criteria3', i) as string ||"";
				const evaluation_criteria4 = this.getNodeParameter('criteria4', i) as string ||"";
				const evaluation_criteria5 = this.getNodeParameter('criteria5', i) as string ||"";


				const evaluation_criteria = [evaluation_criteria1, evaluation_criteria2, evaluation_criteria3, evaluation_criteria4, evaluation_criteria5]
    .filter(c => c && c.trim() !== "");


				const type = this.getNodeParameter('type', i) as string;

				//const condition = this.getNodeParameter('condition', i) as string;
        //const threshold = this.getNodeParameter('threshold', i) as number;
        const credentials = await this.getCredentials('jaasaiApi');
        const apiKey = credentials.apiKey as string;
				if (apiKey === undefined) {
					throw new NodeOperationError(this.getNode(), 'No API key provided!');
				}
				//console.log('API Key:', apiKey);
				// Fetch the data from the JaaS API
        const jaasData = await this.helpers.request({
          method: 'POST',
          //url: `http://api.jaas-ai.com/v1/evaluate`,
					url: 'https://api.jaas-ai.com/v1/evaluate',

					headers: {
						'accept': 'application/json',
						'Authorization': 'Bearer ' + apiKey,
					},
					body: {
						'question': question,
						'ground_truth_answer': ground_truth_answer,
						'answer': answer,
						'context': context,
						//other parameters,
						'evaluation_criteria': evaluation_criteria, // or use the condition variable
						'type': type, // 'S' for single, 'D' for conversational, 'V' for verified
						'cohort': cohort, // Cohort name, e.g., 'N8N-NC'-> Default

          },
          json: true,
        });


        returnData.push({
          json: {
            'status': jaasData.status,
						'criteria': jaasData.criteria,
						'type': jaasData.evaluation_type,
          },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error);
      }
    }
    return [returnData];
  }
}

