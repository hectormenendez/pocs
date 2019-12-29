import Endpoints from '~/config/endpoints'; // eslint-disable-line no-unused-vars
import { PASS, DEBUG } from '~/server/constants';

const PDIAZ = { ...DEBUG, host: Endpoints.pdiaz };
const MCHAN = { ...DEBUG, host: Endpoints.mchan };
const SSOSA = { ...DEBUG, host: Endpoints.ssosa };
const AABALO = { ...DEBUG, host: Endpoints.mchan };

export default {

    'OPTIONS:/weather.get': PASS,
    'POST:/weather.get': PASS,

    'OPTIONS:/configuration.listConfiguration': PASS,
    'POST:/configuration.listConfiguration': PASS,

    'OPTIONS:/messages.listMessages': PASS,
    'POST:/messages.listMessages': SSOSA,

    'OPTIONS:/session.login.step1': PASS,
    'POST:/session.login.step1': PDIAZ,

    'OPTIONS:/session.login.step2': PASS,
    'POST:/session.login.step2': PDIAZ,
};
