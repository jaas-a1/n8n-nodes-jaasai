import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class Jaasai implements ICredentialType {
  name = 'jaasaiApi';
  displayName = 'JaaS AI API';
  documentationUrl = 'https://jaas-ai.net';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
			typeOptions: {
    		password: true,
  		},
      default: '',
      required: true,
      description: 'Your JaaS AI API key',
    },
  ];
}
