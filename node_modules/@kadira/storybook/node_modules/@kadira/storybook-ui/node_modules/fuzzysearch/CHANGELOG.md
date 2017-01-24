# v1.0.3 Short Fuse

- Improved circuit-breaker when `needle` and `haystack` length are equal

# v1.0.2 Vodka Tonic

- Slightly updated circuit-breaker that tests for equal length first
- Doubled method performance ([see jsperf tests](http://jsperf.com/fuzzysearch-regex/3))

# v1.0.1 Circuit Breaker

- Introduced a circuit-breaker where queries longer than the searched string will return `false`
- Introduced a circuit-breaker where queries identical to the searched string will return `true`
- Introduced a circuit-breaker where text containing the entire query will return `true`

# v1.0.0 IPO

- Initial Public Release
