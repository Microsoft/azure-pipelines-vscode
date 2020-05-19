/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License.
*--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import * as languageclient from 'vscode-languageclient';

export interface ISchemaAssociationService {
    getSchemaAssociation(): ISchemaAssociations;
}

// TODO: I think we can remove this class. Make it simpler?
export class SchemaAssociationService implements ISchemaAssociationService {

    /* Where the schema file is on disk. This is packaged with the extension, in the root, at service-schema.json. */
    schemaFilePath: string;

    constructor(extensionPath: string) {
        const alternateSchema = vscode.workspace.getConfiguration('[azure-pipelines]', null).get<string>('customSchemaFile');
        const schemaPath = alternateSchema || path.join(extensionPath, './service-schema.json');
        this.schemaFilePath = vscode.Uri.file(schemaPath).toString();
    }

    public getSchemaAssociation(): ISchemaAssociations {
        return { '*': [this.schemaFilePath] };
    }
}

// TODO: Do we need this?
export interface ISchemaAssociations {
	[pattern: string]: string[];
}

// TODO: Do we need this?
export namespace SchemaAssociationNotification {
	export const type: languageclient.NotificationType<ISchemaAssociations, any> = new languageclient.NotificationType('json/schemaAssociations');
}
