var padNumber = function (number, pad, len) {
    var retval, n, padded;

    retval = number.toString();
    n = len - retval.length;
    padded = new Array(n + 1).join(pad);

    return padded + retval;
};

