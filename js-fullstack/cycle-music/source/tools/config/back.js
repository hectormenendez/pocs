// NPM modules
import DeepMerge from 'deepmerge';
// local modules
import Path from 'tools/path';
import Replacer from 'tools/replacer';
import ConfigCommon from 'config/common';
import ConfigBack from 'config/back';

// make Path available tor the config, but don't make it part of the final conf
const config = Replacer(DeepMerge.all([{ PATH: Path }, ConfigCommon, ConfigBack]));
delete config.PATH;

export default config;
