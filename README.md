# kibana-recycler

Removes indexes from elasticsearch based on a search pattern (for use with time/date based indexing)

You can specify a number of 'patterns' to search for in your config.json file.

Each pattern can accept:
* **host** (optional) - defaults to **http://localhost:9200**
* **pattern** - search pattern for indexes - e.g. **log.prod-\*** for indexes in format **log.prod-2015.01.01**
* **window** (optional) - defaults to 7

The window property on a pattern specifies the number of indexes it will leave alone - the way this works is to search elasticsearch for indexes matching the pattern you specify, sort the matched indexes descending (so dates will be most recent first) and then remove any indexes from index **window** onwards

###Example

With a window of 4 and the following indexes in elasticsearch:

* 'log.dev-2015.03.31'
* 'log.dev-2015.03.30'
* 'log.dev-2015.03.28'
* 'log.dev-2015.03.27'
* 'log.dev-2015.03.26'
* 'log.dev-2015.03.25'
* 'log.dev-2015.03.24'
* 'log.dev-2015.03.23'
* 'log.dev-2015.03.18'
* 'log.dev-2015.03.16'
* 'log.dev-2015.03.15'
* 'log.dev-2015.03.14'

The following indexes would be removed:

* 'log.dev-2015.03.26'
* 'log.dev-2015.03.25'
* 'log.dev-2015.03.24'
* 'log.dev-2015.03.23'
* 'log.dev-2015.03.18'
* 'log.dev-2015.03.16'
* 'log.dev-2015.03.15'
* 'log.dev-2015.03.14'