/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const chaincodejoao = require('./lib/chaincodejoao');

module.exports.ChaincodeJoao = chaincodejoao;
module.exports.contracts = [chaincodejoao];
