/* @flow */

var opts = {
  CLOSEST_LOWER: 1,
  CLOSEST_HIGHER: 2
};

var binaryIndexSearch = function(array/* : Array<number> */,
                                 item/* : number */,
                                 opt/* : number */)/* : ?number */ {
  var index;

  var high = array.length - 1,
      low = 0,
      middle,
      middleItem;

  while (low <= high) {
    middle = low + Math.floor((high - low) / 2);
    middleItem = array[middle];

    if (middleItem === item) {
      return middle;
    } else if (middleItem < item) {
      low = middle + 1;
    } else if (middleItem > item) {
      high = middle - 1;
    }
  }

  if (opt === opts.CLOSEST_LOWER && low > 0) {
    index = low - 1;
  } else if (opt === opts.CLOSEST_HIGHER && high < array.length - 1) {
    index = high + 1;
  }

  return index;
};

module.exports = {
  binaryIndexSearch: binaryIndexSearch,
  opts: opts
};
