import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const StatusCard = ({ title, value, icon, color = "primary", trend = "stable", subtitle = "", isMobile = false }) => {
  const colorClasses = {
    primary: "from-jk-primary to-jk-secondary text-white",
    success: "from-green-500 to-green-600 text-white",
    warning: "from-amber-500 to-amber-600 text-white",
    danger: "from-red-500 to-red-600 text-white",
  }

  const getTrendIcon = () => {
    const iconSize = isMobile ? "w-3 h-3" : "w-4 h-4"
    switch (trend) {
      case "up":
        return <TrendingUp className={`${iconSize} text-green-400`} />
      case "down":
        return <TrendingDown className={`${iconSize} text-red-400`} />
      default:
        return <Minus className={`${iconSize} text-gray-400`} />
    }
  }

  return (
    <div className="jk-metric-card group touch-feedback">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex-1 min-w-0">
          <p
            className={`${isMobile ? "text-xs" : "text-sm"} font-medium text-gray-600 uppercase tracking-wide truncate`}
          >
            {title}
          </p>
          <p
            className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-gray-900 mt-1 sm:mt-2 group-hover:text-jk-primary transition-colors`}
          >
            {value}
          </p>
          {subtitle && (
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 mt-1 flex items-center space-x-1`}>
              {getTrendIcon()}
              <span className="truncate">{subtitle}</span>
            </p>
          )}
        </div>
        <div
          className={`${isMobile ? "p-2" : "p-4"} rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          {icon}
        </div>
      </div>

      {/* Progress bar for visual appeal */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2 sm:mt-4">
        <div
          className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-1000`}
          style={{ width: `${Math.min(Math.random() * 100 + 20, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}

export default StatusCard
