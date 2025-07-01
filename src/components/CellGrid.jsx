import { Battery, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

const CellGrid = ({ cellVoltages = [], isMobile = false }) => {
  const getCellColor = (voltage) => {
    if (voltage >= 3.4) return "excellent"
    if (voltage >= 3.3) return "good"
    if (voltage >= 3.2) return "normal"
    if (voltage >= 3.0) return "low"
    return "critical"
  }

  const getCellClasses = (color) => {
    const classes = {
      excellent: "jk-cell-excellent shadow-green-500/30",
      good: "jk-cell-good shadow-lime-500/30",
      normal: "jk-cell-normal shadow-yellow-500/30",
      low: "jk-cell-low shadow-orange-500/30",
      critical: "jk-cell-critical shadow-red-500/30 animate-pulse-slow",
    }
    return classes[color] || classes.normal
  }

  const maxVoltage = cellVoltages.length > 0 ? Math.max(...cellVoltages) : 0
  const minVoltage = cellVoltages.length > 0 ? Math.min(...cellVoltages) : 0
  const avgVoltage = cellVoltages.length > 0 ? cellVoltages.reduce((a, b) => a + b, 0) / cellVoltages.length : 0
  const imbalance = maxVoltage - minVoltage

  return (
    <div className="space-y-4 sm:space-y-8 animate-fade-in">
      {/* Summary Statistics - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="jk-card p-3 sm:p-6 text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <TrendingUp className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-green-500`} />
          </div>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600 uppercase tracking-wide`}>Highest</p>
          <p className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-green-600 mt-1 sm:mt-2`}>
            {maxVoltage.toFixed(3)}V
          </p>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 mt-1`}>
            Cell #{cellVoltages.indexOf(maxVoltage) + 1}
          </p>
        </div>

        <div className="jk-card p-3 sm:p-6 text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <TrendingDown className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-red-500`} />
          </div>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600 uppercase tracking-wide`}>Lowest</p>
          <p className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-red-600 mt-1 sm:mt-2`}>
            {minVoltage.toFixed(3)}V
          </p>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 mt-1`}>
            Cell #{cellVoltages.indexOf(minVoltage) + 1}
          </p>
        </div>

        <div className="jk-card p-3 sm:p-6 text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <Battery className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-jk-primary`} />
          </div>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600 uppercase tracking-wide`}>Average</p>
          <p className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-jk-primary mt-1 sm:mt-2`}>
            {avgVoltage.toFixed(3)}V
          </p>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 mt-1`}>Pack Avg</p>
        </div>

        <div className="jk-card p-3 sm:p-6 text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <AlertTriangle
              className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} ${
                imbalance > 0.05 ? "text-red-500 animate-pulse-slow" : "text-green-500"
              }`}
            />
          </div>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600 uppercase tracking-wide`}>Imbalance</p>
          <p
            className={`${isMobile ? "text-xl" : "text-3xl"} font-bold mt-1 sm:mt-2 ${
              imbalance > 0.05 ? "text-red-600" : "text-green-600"
            }`}
          >
            {(imbalance * 1000).toFixed(0)}mV
          </p>
          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 mt-1`}>
            {imbalance > 0.05 ? "Needs Balance" : "Balanced"}
          </p>
        </div>
      </div>

      {/* Cell Voltage Grid - Mobile Optimized */}
      <div className="jk-card p-4 sm:p-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h3
            className={`${isMobile ? "text-lg" : "text-2xl"} font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3`}
          >
            <Battery className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-jk-primary`} />
            <span>Cell Monitor</span>
          </h3>
          <div className="text-right">
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600`}>Total</p>
            <p className={`${isMobile ? "text-lg" : "text-2xl"} font-bold text-jk-primary`}>{cellVoltages.length}</p>
          </div>
        </div>

        {cellVoltages.length > 0 ? (
          <div
            className={`grid gap-2 sm:gap-4 ${
              isMobile ? "grid-cols-3 xs:grid-cols-4" : "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8"
            }`}
          >
            {cellVoltages.map((voltage, index) => {
              const color = getCellColor(voltage)
              const isHighest = voltage === maxVoltage
              const isLowest = voltage === minVoltage

              return (
                <div
                  key={index}
                  className={`relative p-2 sm:p-4 rounded-lg sm:rounded-xl text-center shadow-lg transition-all duration-300 active:scale-95 ${getCellClasses(color)} ${
                    isHighest ? "ring-2 ring-green-400" : isLowest ? "ring-2 ring-red-400" : ""
                  }`}
                >
                  {/* Cell indicator */}
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Battery className={`${isMobile ? "w-4 h-4" : "w-6 h-6"}`} />
                    {isHighest && <TrendingUp className="w-3 h-3 ml-1" />}
                    {isLowest && <TrendingDown className="w-3 h-3 ml-1" />}
                  </div>

                  <p className={`${isMobile ? "text-xs" : "text-xs"} font-semibold mb-1 opacity-90`}>
                    {isMobile ? index + 1 : `Cell ${index + 1}`}
                  </p>
                  <p className={`${isMobile ? "text-sm" : "text-lg"} font-bold`}>{voltage.toFixed(3)}V</p>

                  {/* Voltage bar indicator */}
                  <div className="w-full bg-white/30 rounded-full h-1 sm:h-1.5 mt-1 sm:mt-2">
                    <div
                      className="h-1 sm:h-1.5 bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${((voltage - 3.0) / 0.6) * 100}%` }}
                    ></div>
                  </div>

                  {/* Status badges */}
                  {isHighest && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">
                      {isMobile ? "H" : "MAX"}
                    </div>
                  )}
                  {isLowest && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">
                      {isMobile ? "L" : "MIN"}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-16 text-gray-500">
            <Battery className={`${isMobile ? "w-12 h-12" : "w-16 h-16"} mx-auto mb-4 opacity-50`} />
            <p className={`${isMobile ? "text-lg" : "text-xl"} font-semibold`}>No Cell Data</p>
            <p className={`${isMobile ? "text-sm" : "text-sm"} mt-2`}>Waiting for BMS...</p>
          </div>
        )}
      </div>

      {/* Imbalance Warning - Mobile Optimized */}
      {cellVoltages.length > 0 && imbalance > 0.05 && (
        <div className="jk-card border-l-4 border-red-500 bg-red-50 p-4 sm:p-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <AlertTriangle
              className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-red-600 animate-pulse-slow flex-shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-red-800 ${isMobile ? "text-base" : "text-lg"}`}>Cell Imbalance</h4>
              <p className={`text-red-700 mt-1 sm:mt-2 ${isMobile ? "text-sm" : "text-base"}`}>
                Difference: <span className="font-bold">{(imbalance * 1000).toFixed(0)}mV</span>
              </p>
              <p className={`text-red-600 ${isMobile ? "text-xs" : "text-sm"} mt-1`}>
                Max: {maxVoltage.toFixed(3)}V | Min: {minVoltage.toFixed(3)}V
              </p>
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-100 rounded-lg">
                <p className={`text-red-800 ${isMobile ? "text-xs" : "text-sm"} font-medium`}>
                  ⚠️ Enable balancing or check cell health
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CellGrid
