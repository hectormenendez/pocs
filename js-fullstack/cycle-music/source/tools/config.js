// NPM modules
import DeepMerge from 'deepmerge';
// local modules
import Replacer from 'tools/replacer';
import ConfigCommon from 'config/common';
import ConfigFront from 'config/front';

export default DeepMerge(ConfigCommon, ConfigFront);
