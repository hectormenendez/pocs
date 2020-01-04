import { makeHistoryDriver as Make } from '@cycle/history';
import { Driver } from '../types/driver-history';

export default function Driver(): Driver {
    return Make();
}
