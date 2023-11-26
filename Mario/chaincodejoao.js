/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

const shim = require('fabric-shim');

const ClientIdentity = require('fabric-shim').ClientIdentity;


class ChainodeJoao extends Contract {

 // -------------------------------------  Funções ----------------------------------------------------------------//

    async InitLedger(ctx) {
		
		var data = new Date();

        const assets = [
             {
                ID: 'initN001',
                Nome: 'Init',
                Telefone: 'Init', 
				Endereco: 'Init', 				
				Data: data.toString(),
            },
            
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }
 
    async Cadastrar(ctx, id, nome, telefone, endereco) {
        
		var data = new Date();
		
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
			console.log('O  registro de número  ' + id +' já foi cadastrado e não pode ser repetido.');
            throw new Error(`O  registro de número ${id} já foi cadastrado e não pode ser repetido.`);  
          return;
        }
        
      
        const cid = ctx.clientIdentity;
        let MSPID_ORIGEM = cid.getMSPID();
        
        const asset = {
            ID: id,
            Nome: nome,
            Telefone: telefone,
            Endereco: endereco,
			Data: data.toString(),

        };
            ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
            return JSON.stringify(asset);
        
    }
    
    async PesquisarPorId(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {        
          console.log('O registro de número ' + id +' não existe.');
          return;
        }
        return assetJSON.toString();
    }

    async Atualizar(ctx, id, nome, telefone, endereco) {
        
		var data = new Date();
		
		const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`O registro de número ${id} não existe.`);
			return; 
        }
        else 
        {
            
            const updatedAsset = {
              ID: id,
              Nome: nome,
			 Telefone: telefone,
             Endereco: endereco,
			 Data: data.toString()
              
          };
      	
		 ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
		 return JSON.stringify(updatedAsset);
         
      }
    }

    async Excluir(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`O registro ${id} nao existe`);
        }
        return ctx.stub.deleteState(id);
    }

    async BuscarTodos(ctx) {
        const allResults = [];     
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
	
	
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

}

module.exports = ChainodeJoao;