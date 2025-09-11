
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
			// Added this for testing.
			{

				displayName: 'Evaluation Fields: Question',
				name: 'question',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Answer',
				name: 'answer',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Ground Truth Answer',
				name: 'ground_truth_answer',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Cohort',
				name: 'cohort',
				type: 'string',
				default: 'N8N-NC',
			},
    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    //const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    try {
      //const city = this.getNodeParameter('city', i) as string;
      const question = this.getNodeParameter('question',0)||"";//items[i].json.question as string||"";
			const answer  = this.getNodeParameter('answer',0)|| "";//items[i].json.answer as string||"";
			const context = this.getNodeParameter('context',0)||"";//items[i].json.context as string||"";
			const ground_truth_answer = this.getNodeParameter('ground_truth_answer',0)||"";//items[i].json.ground_truth_answer as string||"";
			const cohort = this.getNodeParameter('cohort',0)||"N8N-NC";//items[i].json.cohort as string||"N8N-NC";

			const evaluation_criteria1 = this.getNodeParameter('criteria1', 0) as string ||"Accuracy";
			const evaluation_criteria2 = this.getNodeParameter('criteria2', 0) as string ||"";
			const evaluation_criteria3 = this.getNodeParameter('criteria3', 0) as string ||"";
			const evaluation_criteria4 = this.getNodeParameter('criteria4', 0) as string ||"";
			const evaluation_criteria5 = this.getNodeParameter('criteria5', 0) as string ||"";


			const evaluation_criteria = [evaluation_criteria1, evaluation_criteria2, evaluation_criteria3, evaluation_criteria4, evaluation_criteria5]
    .filter(c => c && c.trim() !== "");


			const type = this.getNodeParameter('type', 0) as string;

				//const condition = this.getNodeParameter('condition', i) as string;
        //const threshold = this.getNodeParameter('threshold', i) as number;
      const credentials = await this.getCredentials('jaasaiApi');
      const apiKey = credentials.apiKey as string;
			if (apiKey === undefined) {
				throw new NodeOperationError(this.getNode(), 'No API key provided!');
			}
			//console.log('API Key:', apiKey);
			// Fetch the data from the JaaS AP
			const jaasData = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'jaasaiApi', // credential name
				{
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
     	  }
			);


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
					pairedItem: {
 						item: 0,
					},
        });
        //continue;
      }
      throw new NodeOperationError(this.getNode(), error);
    }

    return [returnData];
  }
}

