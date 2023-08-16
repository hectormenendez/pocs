/* eslint-disable no-extend-native, no-param-reassign */

function padStart (len, chr) {
    len >>= 0; // eslint-disable-line no-bitwise
    chr = String(typeof chr !== 'undefined' ? chr : ' ');
    if (this.length > len) return String(this);
    len -= this.length;
    if (len > chr.length) chr += chr.repeat(len / chr.length);
    return chr.slice(0, len) + String(this);
}

// Not available on Android.
if (!String.prototype.padStart) String.prototype.padStart = padStart;

/* eslint-enable no-extend-native, no-param-reassign */
