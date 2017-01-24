# react-fuzzy
fuzzy search in React

##Installation

```shell
npm install --save react-fuzzy
```

##Basic Usage

```js
const list = [{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
}, {
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
}, {
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];

<FuzzySearch
      list={list}
      keys={['author', 'title']}
      width={430}
      onSelect={action('selected')}
    />
```

##Options

attribute|default|description
---------|-------|-----------
caseSensitive|false|Indicates whether comparisons should be case sensitive.
className|null|give a custom class name to the root element
distance|100|Determines how close the match must be to the fuzzy location (specified by location). An exact letter match which is distance characters away from the fuzzy location would score as a complete mismatch. A distance of 0 requires the match be at the exact location specified, a distance of 1000 would require a perfect match to be within 800 characters of the location to be found using a threshold of 0.8.
id|null|The name of the identifier property. If specified, the returned result will be a list of the items' identifiers, otherwise it will be a list of the items.
include|[]|An array of values that should be included from the searcher's output. When this array contains elements, each result in the list will be of the form `{ item: ..., include1: ..., include2: ... }`. Values you can include are score, matches. Eg: `{ include: ['score', 'matches' ] }`
maxPatternLength|32|The maximum length of the pattern. The longer the pattern, the more intensive the search operation will be. Whenever the pattern exceeds the maxPatternLength, an error will be thrown.
onSelect| noop | Function to be executed on selection of any result.
width|430|width of the fuzzy searchbox
keys|all[Array]|List of properties that will be searched. This also supports nested properties.
list|null|Array of properties to be filtered.
placeholder|'Search'|Placeholder of the searchbox
resultsTemplate| Func | Template of the dropdown divs
shouldSort| true | Whether to sort the result list, by score.
sortFn|`Array.prototype.sort`|The function that is used for sorting the result list.
threshold|0.6|At what point does the match algorithm give up. A threshold of `0.0` requires a perfect match (of both letters and location), a threshold of `1.0` would match anything.
tokenize|false|When true, the search algorithm will search individual words and the full string, computing the final score as a function of both. Note that when tokenize is true, the `threshold`, `distance`, and `location` are inconsequential for individual tokens.
verbose|false|Will print to the console. Useful for debugging.

##License
MIT @ Ritesh Kumar

