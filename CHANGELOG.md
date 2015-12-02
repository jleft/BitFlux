# Change Log
**All notable changes to the project will be documented in this file.**

## [0.8.0] - 02-12-2015
### Added
- Loading screen while data is loading
- SVG sprite generation for icons
- Release notes

### Changed
- Navigator handle styling
- Series/indicator buttons
- Dropdown/component buttons
- Removed slide out menu from mobile version
- Consistency updates for components
- Faster builds

### Fixed
- Products now show while data is loading
- Layout suspended function reapplied to the navigator
- Navigator focus rectangle displays correctly in Firefox
- Primary chart render console error fixed for IE
- Zoom in extent now limited
- Secondary chart bar series colours

## [0.7.0] - 17-11-2015
### Changed
- Series/indicator stroke widths
- Series colour
- Product selector style
- Period selector style
- Updated d3fc dependency to 4.x.x
- Removed necessary calls outside of render function
- Separated model checking and rendering
- Removed foreground from secondary charts
- Reset button styling
- Crosshair styling
- Legend styling
- Button styling
- Fonts
- Colour scheme
- Update d3fc dependency to 3.x.x
- Removed usage of global models
- Move code to use fc.util.dataJoin where possible

### Fixed
- Main x-axis no longer too wide
- Layout in Firefox and IE
- Period selector displays period correctly
- Button group components are now idempotent
- Bollinger bands display underneath series
- Layout of charts updates correcty
- Exclude livreload script from production build

## [0.6.0] - 27-10-2015
### Added
- Crosshair to primary chart
- Model for products
- Model for periods
- Legend
- Volume chart
- Loading screen while data is loading
- Added EOD option

### Changed
- Limited axis ticks
- Replaced linearTimeSeries with cartesianChart
- Primary chart indicator period length

### Fixed
- Gap between chart and x-axis removed
- Navigator bar panning zoom-in bug

## [0.5.0] - 18-09-2015
### Added
- Ability to add up to 2 secondary charts
- Ability to add multiple indicators at the same time
- Mobile friendly menu

### Changed
- Moved y-axis to the right of the secondary charts
- Added y-axis to MACD panel
- Removed 'chart' suffix from sc.chart.modules
- Zoom does not move from latest price when tracking live data
- Number of visible data points stay the same when tracking live data
- Modularised the entire application

### Fixed
- Panning before indicators begin no longer breaks line render
- Series selections buttons activate state now consistent across all browsers

## [0.4.0] - 08-09-2015
### Added
- MACD chart
- Ability to change period of data
- Coinbase historic feed as data feed
- Mock live data source
- Coinbase OHLC adapter as data feed for the chart

### Changed
- Bollinger band styling
- Bollinger band no longer shows moving average by default
- Y extent depends on displayed series and indicators
- Primary and secondary charts share the same x-axis
- Chart sizes to parent container

### Fixed
- Issue where calculating primary chart y extent before running indicators algorithms would case error

## [0.3.0] - 25-08-2015
### Added
- Modularise navigator
- Modularise primary chart
- Modularise secondary chart
- Line to separate the buttons from the charts
- Moved from CSS to Less

### Changed
- Hide secondary chart by default
- Chart now fills screen on mobile devices
- Navigator now a fixed height
- Removed y-axis tick marks and labels from the navigator
- Primary chart technical indicators
- Aggregate data from historic and live Coinbase data sources

### Fixed
- Issue where switching from live data to generated would cause a basket of live data to be added to the generated data
- Latest price annotation mismatch
- Issue where area series y0 value appeared above the x-axis

## [0.2.0] - 12-08-2015
### Added
- Close price annotation callout label on y-axis
- Live Coinbase data source 
- Historical Coinbase data source

### Changed
- Primary chart series types
- Converted Coinbase data from trades to OHLC
