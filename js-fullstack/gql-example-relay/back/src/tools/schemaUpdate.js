/* eslint-disable import/no-dynamic-require */

// Native
import FS from 'fs';
import PATH from 'path';
// Modules
import Thrower from '@gik/tools-thrower';
import { printSchema as SchemaPrint } from 'graphql';
// Local
import Config from 'tools/config';
import Log from 'tools/logger';
import Schema from 'graphql/schema';

FS.writeFile(PATH.join(Config.path.out, 'schema.graphql'), SchemaPrint(Schema), (err) => {
    if (err) Thrower(err);
    Log.info('Generated schema.graphql');
});
