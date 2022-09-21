const MAX_ARRAY_LENGTH = 10;
const MAX_STRING_LENGTH = 1024;
const MAX_ITERATIONS = 20;

export const trimObject = (el: any, numOfIteration = 0, strmaxlen = MAX_STRING_LENGTH, arrmaxlen = MAX_ARRAY_LENGTH, throwError = false) => {
  let res = el;

  if (numOfIteration >= MAX_ITERATIONS) {
    return '';
  }

  if (Array.isArray(el)) {
    if (el.length > arrmaxlen && throwError) {
      throw new Error('Too many elements in array');
    }
    res = el.length > arrmaxlen ? el.slice(0, 1).concat([`... and ${el.length - 1} more`]) : el;
    res = res.map((obj: any) => ((typeof obj === 'object') ? trimObject(obj, numOfIteration + 1, strmaxlen, arrmaxlen, throwError) : obj));
  } else if (el && typeof el === 'object') {
    res = el?.$essentials?.() || el;
    res = Object.entries(res).reduce((acc, [k, v]) => ({ ...acc, [k]: trimObject(v, numOfIteration + 1, strmaxlen, arrmaxlen, throwError) }), {});
  } else if (el && typeof el === 'string') {
    res = res.substring(0, strmaxlen);
  }
  return res;
};
