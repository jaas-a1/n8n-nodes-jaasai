import {
  ICredentialType,
  INodeProperties,
	//ICredentialsDecrypted,
	//INodeCredentialTestResult,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class JaasaiApi implements ICredentialType {
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

  test: ICredentialTestRequest = {
    request: {
      url: 'https://api.jaas-ai.com/health', // or a test endpoint
      method: 'GET', // or 'POST' if needed
      //headers: {
      //  'Authorization': '=Bearer {{$credentials.apiKey}}',
      //},
    },

  };
}
